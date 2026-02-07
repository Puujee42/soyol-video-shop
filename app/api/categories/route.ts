import { NextResponse } from 'next/server';

export const revalidate = 300;

// Mock categories data (replace with database when ready)
const mockCategories = [
  { id: '1', name: 'Electronics', icon: '💻', subcategories: [] },
  { id: '2', name: 'Fashion', icon: '👗', subcategories: [] },
  { id: '3', name: 'Home', icon: '🏠', subcategories: [] },
  { id: '4', name: 'Beauty', icon: '💄', subcategories: [] },
];

export async function GET() {
  return NextResponse.json(mockCategories, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
