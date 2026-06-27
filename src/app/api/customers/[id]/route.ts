import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
      include: {
        orders: true
      }
    })
    
    if (!customer) {
      return createErrorResponse('Customer not found', 404)
    }
    
    return createResponse(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: body,
      include: {
        orders: true
      }
    })
    
    return createResponse(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    await prisma.customer.delete({
      where: { id: parseInt(id) }
    })
    
    return createResponse({ message: 'Customer deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
