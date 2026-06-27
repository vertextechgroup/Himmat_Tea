import { NextRequest, NextResponse } from 'next/server'
import { mockDb } from '@/lib/mock-data'

export async function GET() {
  try {
    return NextResponse.json(mockDb.products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct = mockDb.addProduct(body)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
