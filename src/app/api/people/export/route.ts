import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const people = await db.person.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      exportDate: new Date().toISOString(),
      totalRecords: people.length,
      records: people
    });

  } catch (error) {
    console.error('Error exporting people records:', error);
    return NextResponse.json(
      { error: 'Failed to export people records' },
      { status: 500 }
    );
  }
}