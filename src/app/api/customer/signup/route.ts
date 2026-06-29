import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'
import { setAuthCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, address } = body
    console.log("/api/customer/signup: Signup attempt for email:", email);

    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    })

    if (existingCustomer) {
      return createErrorResponse('Email already exists', 400)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        passwordHash,
        tier: 'Bronze',
        loyaltyPoints: 0,
        ordersCount: 0,
        totalSpent: 0
      }
    })

    console.log("/api/customer/signup: Customer created!");
    
    await setAuthCookie({
      id: customer.id,
      email: customer.email,
      type: 'customer'
    })
    
    return createResponse({
      success: true,
      user: customer
    })
  } catch (error) {
    console.error("/api/customer/signup: Error:", error);
    return handleApiError(error)
  }
}
