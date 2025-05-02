import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean the database (Optional)
  await prisma.booking.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.hospital.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    }
  });

  console.log(`Created user: ${user.email}`);

  // Create hospitals
  const hospital1 = await prisma.hospital.create({
    data: {
      name: 'General Hospital',
      location: 'Downtown, City',
    }
  });

  const hospital2 = await prisma.hospital.create({
    data: {
      name: 'Community Medical Center',
      location: 'Uptown, City',
    }
  });

  const hospital3 = await prisma.hospital.create({
    data: {
      name: 'Children\'s Hospital',
      location: 'Suburb, City',
    }
  });

  console.log(`Created ${3} hospitals`);

  // Create services for each hospital
  const services = [];

  // Hospital 1 services
  services.push(
    await prisma.service.create({
      data: {
        name: 'General Checkup',
        description: 'Complete physical examination',
        price: 100.00,
        duration: 30,
        hospitalId: hospital1.id
      }
    })
  );

  services.push(
    await prisma.service.create({
      data: {
        name: 'Blood Test',
        description: 'Complete blood panel',
        price: 50.00,
        duration: 15,
        hospitalId: hospital1.id
      }
    })
  );

  // Hospital 2 services
  services.push(
    await prisma.service.create({
      data: {
        name: 'X-Ray',
        description: 'X-Ray imaging service',
        price: 150.00,
        duration: 20,
        hospitalId: hospital2.id
      }
    })
  );

  services.push(
    await prisma.service.create({
      data: {
        name: 'MRI Scan',
        description: 'Magnetic Resonance Imaging',
        price: 300.00,
        duration: 45,
        hospitalId: hospital2.id
      }
    })
  );

  // Hospital 3 services
  services.push(
    await prisma.service.create({
      data: {
        name: 'Pediatric Checkup',
        description: 'Checkup for children',
        price: 80.00,
        duration: 25,
        hospitalId: hospital3.id
      }
    })
  );

  services.push(
    await prisma.service.create({
      data: {
        name: 'Vaccination',
        description: 'Standard childhood vaccines',
        price: 60.00,
        duration: 10,
        hospitalId: hospital3.id
      }
    })
  );

  console.log(`Created ${services.length} services`);

  // Create a sample booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      serviceId: services[0].id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
      status: 'confirmed'
    }
  });

  console.log(`Created a sample booking`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 