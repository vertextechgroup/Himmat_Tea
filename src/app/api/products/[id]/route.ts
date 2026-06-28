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
    
    // Parse JSON strings back to objects
    const parsedProduct = {
      ...product,
      variantOptions: product.variantOptions ? JSON.parse(product.variantOptions) : null,
      productVariants: product.productVariants.map(variant => ({
        ...variant,
        variants: JSON.parse(variant.variants)
      }))
    }
    
    return createResponse(parsedProduct)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Stringify JSON fields before saving
    const data = {
      ...body,
      variantOptions: body.variantOptions ? JSON.stringify(body.variantOptions) : body.variantOptions
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      }
    })
    
    // Parse JSON strings back to objects
    const parsedProduct = {
      ...product,
      variantOptions: product.variantOptions ? JSON.parse(product.variantOptions) : null,
      productVariants: product.productVariants.map(variant => ({
        ...variant,
        variants: JSON.parse(variant.variants)
      }))
    }
    
    return createResponse(parsedProduct)
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
