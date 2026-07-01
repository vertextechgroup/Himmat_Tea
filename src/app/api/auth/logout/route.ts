import { NextRequest, NextResponse } from 'next/server'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    return createResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
