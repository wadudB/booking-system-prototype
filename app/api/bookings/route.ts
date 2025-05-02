import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth-options';

const prisma = new PrismaClient();

// Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        service: {
          include: {
            hospital: true
          }
        }
      }
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId, date } = body;
    
    if (!serviceId || !date) {
      return NextResponse.json(
        { error: 'Service ID and date are required' },
        { status: 400 }
      );
    }
    
    // Validate if service exists
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        serviceId,
        date: new Date(date),
        status: 'pending'
      }
    });
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 