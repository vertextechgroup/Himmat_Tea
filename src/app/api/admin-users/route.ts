import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const adminUsers = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { id: 'desc' }
    })
    return createResponse(adminUsers)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, ...rest } = body
    
    const passwordHash = await bcrypt.hash(password, 10)
    
    const adminUser = await prisma.adminUser.create({
      data: {
        ...rest,
        passwordHash
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return createResponse(adminUser, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
