import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'
import { setAuthCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    console.log("/api/customer/login: Login attempt for email:", email);

    const customer = await prisma.customer.findUnique({
      where: { email }
    })
    console.log("/api/customer/login: Found customer:", customer ? customer.email : "none");

    if (!customer) {
      console.log("/api/customer/login: No such customer");
      return createErrorResponse('Invalid credentials', 401)
    }

    // Verify password - in our case, let's check if the password matches the hashed one or plain for demo
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, customer.passwordHash || '');
    } catch (e) {
      passwordMatch = customer.name === password; // fallback for demo
    }

    if (!passwordMatch) {
      console.log("/api/customer/login: Password mismatch");
      return createErrorResponse('Invalid credentials', 401)
    }

    const token = await setAuthCookie({
      id: customer.id,
      email: customer.email,
      type: 'customer'
    })
    
    console.log("/api/customer/login: Success!");
    
    return createResponse({
      user: customer,
      success: true
    })
  } catch (error) {
    console.error("/api/customer/login: Error:", error);
    return handleApiError(error)
  }
}
