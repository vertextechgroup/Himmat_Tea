import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true
      },
      orderBy: { id: 'desc' }
    })
    return createResponse(customers)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customer = await prisma.customer.create({
      data: body,
      include: {
        orders: true
      }
    })
    return createResponse(customer, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
