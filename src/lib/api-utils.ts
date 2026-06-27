import { NextResponse } from 'next/server'

export function createResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function handleApiError(error: any) {
  console.error('API Error:', error)
  return createErrorResponse('Internal server error', 500)
}
