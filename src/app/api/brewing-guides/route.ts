import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    const guides = await prisma.brewingGuide.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return createResponse(guides)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const guide = await prisma.brewingGuide.create({
      data: body
    })
    return createResponse(guide, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
