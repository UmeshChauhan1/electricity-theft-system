import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get regions with latest meter readings
    const regions = await prisma.region.findMany({
      include: {
        meterReadings: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
        alerts: {
          where: {
            status: {
              in: ['PENDING', 'INVESTIGATING', 'DISPATCHED'],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate statistics
    const stats = {
      totalRegions: regions.length,
      normalRegions: regions.filter(r => r.status === 'NORMAL').length,
      suspiciousRegions: regions.filter(r => r.status === 'SUSPICIOUS').length,
      theftDetected: regions.filter(r => r.status === 'THEFT').length,
      totalLoss: regions.reduce((sum, r) => {
        const latestReading = r.meterReadings[0];
        return sum + (latestReading?.lossPercent || 0);
      }, 0) / regions.length || 0,
    };

    return NextResponse.json({ regions, stats });
  } catch (error) {
    console.error('Get regions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
