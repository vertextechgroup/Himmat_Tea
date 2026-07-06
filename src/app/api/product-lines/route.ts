
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const productLines = await prisma.productLine.findMany({
      include: {
        products: true,
      },
      orderBy: { sortOrder: 'asc' },
    })
    return createResponse(productLines)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productLine = await prisma.productLine.create({
      data: body,
      include: {
        products: true,
      },
    })
    return createResponse(productLine, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

