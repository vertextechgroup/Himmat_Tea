import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    
    // Find admin by either username or email
    const adminUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      }
    })
    
    if (!adminUser || !adminUser.isActive) {
      return createErrorResponse('Invalid credentials', 401)
    }
    
    const passwordMatch = await bcrypt.compare(password, adminUser.passwordHash)
    
    if (!passwordMatch) {
      return createErrorResponse('Invalid credentials', 401)
    }
    
    const { passwordHash, ...userWithoutPassword } = adminUser
    
    return createResponse({
      user: userWithoutPassword,
      success: true
    })
  } catch (error) {
    return handleApiError(error)
  }
}
