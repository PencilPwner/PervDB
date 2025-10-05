import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photo, name, address, phoneNumber, marriedTo, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const person = await db.person.create({
      data: {
        photo: photo || null,
        name,
        address: address || null,
        phoneNumber: phoneNumber || null,
        marriedTo: marriedTo || null,
        status: status || 'uncontacted',
      },
    });

    return NextResponse.json(
      { 
        message: 'Person record created successfully',
        person: {
          id: person.id,
          name: person.name,
          status: person.status,
          createdAt: person.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating person record:', error);
    return NextResponse.json(
      { error: 'Failed to create person record' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const people = await db.person.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        address: true,
        phoneNumber: true,
        marriedTo: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ people });

  } catch (error) {
    console.error('Error fetching people records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people records' },
      { status: 500 }
    );
  }
}