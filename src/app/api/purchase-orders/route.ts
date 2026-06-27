import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { id: 'desc' }
    })
    return createResponse(purchaseOrders)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, ...poData } = body
    
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        ...poData,
        items: {
          create: items.map((item: any) => ({
            ...item
          }))
        }
      },
      include: { items: { include: { product: true } } }
    })
    return createResponse(purchaseOrder, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
