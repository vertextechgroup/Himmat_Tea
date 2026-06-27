import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: { product: true },
      orderBy: { id: 'desc' }
    })
    return createResponse(reviews)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const review = await prisma.review.create({
      data: body,
      include: { product: true }
    })
    return createResponse(review, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
