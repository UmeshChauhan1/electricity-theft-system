import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { analyzeTheft } from '@/lib/theft-detection';
import { sendEmailNotification, sendWhatsAppNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { regionId, inputKwh, outputKwh } = await request.json();

    if (!regionId || !inputKwh || !outputKwh) {
      return NextResponse.json(
        { error: 'Region ID, input and output kWh are required' },
        { status: 400 }
      );
    }

    // Get region
    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }

    // Analyze theft
    const analysis = analyzeTheft({
      inputKwh,
      outputKwh,
      timestamp: new Date(),
    });

    // Calculate loss percentage
    const lossPercent = ((inputKwh - outputKwh) / inputKwh) * 100;

    // Create meter reading
    const meterReading = await prisma.meterReading.create({
      data: {
        regionId,
        inputKwh,
        outputKwh,
        lossPercent: parseFloat(lossPercent.toFixed(2)),
      },
    });

    // Update region status and current load
    let newStatus = region.status;
    if (analysis.isTheft) {
      newStatus = 'THEFT';
    } else if (analysis.isSuspicious) {
      newStatus = 'SUSPICIOUS';
    } else {
      newStatus = 'NORMAL';
    }

    await prisma.region.update({
      where: { id: regionId },
      data: {
        currentLoad: outputKwh,
        status: newStatus,
        lastUpdated: new Date(),
      },
    });

    // Create alert if theft or suspicious
    if (analysis.isTheft || analysis.isSuspicious) {
      // Find an available inspector
      const inspector = await prisma.user.findFirst({
        where: {
          role: 'INSPECTOR',
          isActive: true,
        },
      });

      const alert = await prisma.alert.create({
        data: {
          regionId,
          severity: analysis.severity,
          lossPercentage: analysis.lossPercentage,
          status: 'PENDING',
          description: analysis.reason,
          assignedToId: inspector?.id,
        },
      });

      // Send notifications to inspector
      if (inspector) {
        const notificationMessage = `New ${analysis.severity} severity alert in ${region.name}. Loss: ${analysis.lossPercentage}%`;

        // Create notification record
        await prisma.notification.create({
          data: {
            userId: inspector.id,
            alertId: alert.id,
            type: 'SYSTEM',
            message: notificationMessage,
          },
        });

        // Send email
        if (inspector.email) {
          await sendEmailNotification({
            to: inspector.email,
            subject: `⚡ New ${analysis.severity} Theft Alert`,
            message: notificationMessage,
            alertDetails: {
              region: region.name,
              severity: analysis.severity,
              lossPercentage: analysis.lossPercentage,
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
          });

          await prisma.notification.create({
            data: {
              userId: inspector.id,
              alertId: alert.id,
              type: 'EMAIL',
              message: notificationMessage,
            },
          });
        }

        // Send WhatsApp
        if (inspector.phone) {
          await sendWhatsAppNotification({
            to: inspector.phone,
            message: notificationMessage,
            alertDetails: {
              region: region.name,
              severity: analysis.severity,
              lossPercentage: analysis.lossPercentage,
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
          });

          await prisma.notification.create({
            data: {
              userId: inspector.id,
              alertId: alert.id,
              type: 'WHATSAPP',
              message: notificationMessage,
            },
          });
        }
      }

      return NextResponse.json({
        meterReading,
        analysis,
        alert,
        message: 'Meter reading recorded and alert created',
      });
    }

    return NextResponse.json({
      meterReading,
      analysis,
      message: 'Meter reading recorded successfully',
    });
  } catch (error) {
    console.error('Create meter reading error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
