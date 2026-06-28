import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      }
    })
    
    if (!product) {
      return createErrorResponse('Product not found', 404)
    }
    
    return createResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: body,
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      }
    })
    
    return createResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    
    return createResponse({ message: 'Product deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
