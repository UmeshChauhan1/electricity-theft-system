import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { sendEmailNotification, sendWhatsAppNotification } from '@/lib/notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status, assignedToId, action } = await request.json();
    const alertId = params.id;

    // Get current alert
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        region: true,
        assignedTo: true,
      },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Update alert
    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedToId) updateData.assignedToId = assignedToId;
    if (status === 'RESOLVED') updateData.resolvedAt = new Date();

    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: updateData,
      include: {
        region: true,
        assignedTo: true,
      },
    });

    // Send notifications based on action
    if (action === 'approve' || action === 'dispatch') {
      const notificationMessage = 
        action === 'approve'
          ? `Alert #${alert.id} has been approved for ${alert.region.name}`
          : `Dispatch team assigned to investigate ${alert.region.name}`;

      // Send to assigned inspector
      if (updatedAlert.assignedTo) {
        // Create notification record
        await prisma.notification.create({
          data: {
            userId: updatedAlert.assignedTo.id,
            alertId: updatedAlert.id,
            type: 'EMAIL',
            message: notificationMessage,
          },
        });

        // Send email
        if (updatedAlert.assignedTo.email) {
          await sendEmailNotification({
            to: updatedAlert.assignedTo.email,
            subject: `⚡ Alert ${action === 'approve' ? 'Approved' : 'Dispatched'}`,
            message: notificationMessage,
            alertDetails: {
              region: alert.region.name,
              severity: alert.severity,
              lossPercentage: alert.lossPercentage,
              location: {
                lat: alert.region.latitude,
                lng: alert.region.longitude,
              },
            },
          });
        }

        // Send WhatsApp if phone available
        if (updatedAlert.assignedTo.phone) {
          await sendWhatsAppNotification({
            to: updatedAlert.assignedTo.phone,
            message: notificationMessage,
            alertDetails: {
              region: alert.region.name,
              severity: alert.severity,
              lossPercentage: alert.lossPercentage,
              location: {
                lat: alert.region.latitude,
                lng: alert.region.longitude,
              },
            },
          });

          // Create WhatsApp notification record
          await prisma.notification.create({
            data: {
              userId: updatedAlert.assignedTo.id,
              alertId: updatedAlert.id,
              type: 'WHATSAPP',
              message: notificationMessage,
            },
          });
        }
      }
    }

    return NextResponse.json({ 
      alert: updatedAlert,
      message: `Alert ${action || 'updated'} successfully`,
    });
  } catch (error) {
    console.error('Update alert error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
