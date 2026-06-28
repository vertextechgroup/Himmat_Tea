import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      },
      orderBy: { id: 'desc' }
    })
    return createResponse(products)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: body,
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      }
    })
    return createResponse(product, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
