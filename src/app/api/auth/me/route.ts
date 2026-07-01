import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll just return a 401 since we don't have session handling yet
    return createResponse({ success: false }, 401)
  } catch (error) {
    return handleApiError(error)
  }
}
