import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      include: { product: true },
      orderBy: { timestamp: 'desc' }
    })
    return createResponse(transactions)
  } catch (error) {
    return handleApiError(error)
  }
}
