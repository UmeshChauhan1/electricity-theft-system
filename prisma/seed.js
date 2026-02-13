const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pspcl.gov.in' },
    update: {},
    create: {
      email: 'admin@pspcl.gov.in',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+911234567890',
    },
  });

  const inspector1 = await prisma.user.upsert({
    where: { email: 'inspector1@pspcl.gov.in' },
    update: {},
    create: {
      email: 'inspector1@pspcl.gov.in',
      name: 'Rajesh Kumar',
      password: hashedPassword,
      role: 'INSPECTOR',
      phone: '+911234567891',
    },
  });

  const inspector2 = await prisma.user.upsert({
    where: { email: 'inspector2@pspcl.gov.in' },
    update: {},
    create: {
      email: 'inspector2@pspcl.gov.in',
      name: 'Priya Sharma',
      password: hashedPassword,
      role: 'INSPECTOR',
      phone: '+911234567892',
    },
  });

  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatcher@pspcl.gov.in' },
    update: {},
    create: {
      email: 'dispatcher@pspcl.gov.in',
      name: 'Amit Singh',
      password: hashedPassword,
      role: 'DISPATCHER',
      phone: '+911234567893',
    },
  });

  console.log('✅ Users created');

  // Create regions
  const regions = [
    { name: 'Region A - Ludhiana Central', code: 'LDH-C', lat: 30.9010, lng: 75.8573, expectedLoad: 1250, currentLoad: 1240, status: 'NORMAL' },
    { name: 'Region B - Jagraon', code: 'JGR', lat: 30.7887, lng: 75.4732, expectedLoad: 1100, currentLoad: 890, status: 'SUSPICIOUS' },
    { name: 'Region C - Raikot', code: 'RKT', lat: 30.6500, lng: 75.5986, expectedLoad: 980, currentLoad: 650, status: 'THEFT' },
    { name: 'Region D - Khanna', code: 'KHN', lat: 30.7058, lng: 76.2219, expectedLoad: 1600, currentLoad: 1580, status: 'NORMAL' },
    { name: 'Region E - Samrala', code: 'SML', lat: 30.8350, lng: 76.1930, expectedLoad: 850, currentLoad: 720, status: 'SUSPICIOUS' },
    { name: 'Region F - Doraha', code: 'DRH', lat: 30.8014, lng: 76.0218, expectedLoad: 750, currentLoad: 740, status: 'NORMAL' },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: { currentLoad: region.currentLoad, status: region.status },
      create: {
        name: region.name,
        code: region.code,
        latitude: region.lat,
        longitude: region.lng,
        expectedLoad: region.expectedLoad,
        currentLoad: region.currentLoad,
        status: region.status,
      },
    });
  }

  console.log('✅ Regions created');

  // Create meter readings
  const regionRecords = await prisma.region.findMany();
  
  for (const region of regionRecords) {
    const lossPercent = ((region.expectedLoad - region.currentLoad) / region.expectedLoad) * 100;
    
    await prisma.meterReading.create({
      data: {
        regionId: region.id,
        inputKwh: region.expectedLoad,
        outputKwh: region.currentLoad,
        lossPercent: parseFloat(lossPercent.toFixed(2)),
      },
    });
  }

  console.log('✅ Meter readings created');

  // Create alerts for suspicious/theft regions
  const suspiciousRegions = await prisma.region.findMany({
    where: {
      status: {
        in: ['SUSPICIOUS', 'THEFT']
      }
    }
  });

  for (const region of suspiciousRegions) {
    const lossPercent = ((region.expectedLoad - region.currentLoad) / region.expectedLoad) * 100;
    const severity = lossPercent > 25 ? 'HIGH' : lossPercent > 15 ? 'MEDIUM' : 'LOW';
    
    const alert = await prisma.alert.create({
      data: {
        regionId: region.id,
        severity: severity,
        lossPercentage: parseFloat(lossPercent.toFixed(2)),
        status: 'PENDING',
        description: `Abnormal consumption detected in ${region.name}. Loss: ${lossPercent.toFixed(1)}%`,
        assignedToId: severity === 'HIGH' ? inspector1.id : inspector2.id,
      },
    });

    // Create notifications
    await prisma.notification.create({
      data: {
        userId: severity === 'HIGH' ? inspector1.id : inspector2.id,
        alertId: alert.id,
        type: 'EMAIL',
        message: `New ${severity} severity alert in ${region.name}`,
      },
    });
  }

  console.log('✅ Alerts and notifications created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
