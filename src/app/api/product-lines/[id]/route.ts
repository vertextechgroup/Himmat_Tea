
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const productLine = await prisma.productLine.findUnique({
      where: { id },
      include: { products: true },
    })
    if (!productLine) {
      return NextResponse.json({ error: 'Product line not found' }, { status: 404 })
    }
    return createResponse(productLine)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const productLine = await prisma.productLine.update({
      where: { id },
      data: body,
      include: { products: true },
    })
    return createResponse(productLine)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.productLine.delete({
      where: { id },
    })
    return createResponse({ message: 'Product line deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

