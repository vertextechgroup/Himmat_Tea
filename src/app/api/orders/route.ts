import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true,
        internalNotes: true
      },
      orderBy: { orderDate: 'desc' }
    })
    return createResponse(orders)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerId, ...orderData } = body
    
    const order = await prisma.order.create({
      data: {
        ...orderData,
        customerId: customerId || 1,
        items: {
          create: items.map((item: any) => ({
            ...item
          }))
        }
      },
      include: {
        customer: true,
        items: true,
        internalNotes: true
      }
    })
    
    // Update customer stats
    if (customerId) {
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          ordersCount: { increment: 1 },
          totalSpent: { increment: order.grandTotal }
        }
      })
    }
    
    return createResponse(order, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
