import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        productLine: true,
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      },
      orderBy: { id: 'desc' }
    })
    
    // Parse JSON strings back to objects
    const parsedProducts = products.map(product => ({
      ...product,
      variantOptions: product.variantOptions ? JSON.parse(product.variantOptions) : null,
      productVariants: product.productVariants.map(variant => ({
        ...variant,
        variants: JSON.parse(variant.variants)
      }))
    }))
    
    return createResponse(parsedProducts)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Stringify JSON fields before saving
    const data = {
      ...body,
      variantOptions: body.variantOptions ? JSON.stringify(body.variantOptions) : null
    }
    
    const product = await prisma.product.create({
      data,
      include: {
        productVariants: true,
        batches: true,
        reviews: true,
        collectionItems: { include: { collection: true } },
        inventoryTransactions: true
      }
    })
    
    // Parse back for response
    const parsedProduct = {
      ...product,
      variantOptions: product.variantOptions ? JSON.parse(product.variantOptions) : null,
      productVariants: product.productVariants.map(variant => ({
        ...variant,
        variants: JSON.parse(variant.variants)
      }))
    }
    
    return createResponse(parsedProduct, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
