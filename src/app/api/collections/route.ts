import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return createResponse(collections)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const collection = await prisma.collection.create({
      data: body,
      include: { items: { include: { product: true } } }
    })
    return createResponse(collection, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
