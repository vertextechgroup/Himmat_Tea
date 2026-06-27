import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    })
    return createResponse(faqs)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const faq = await prisma.fAQ.create({
      data: body
    })
    return createResponse(faq, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
