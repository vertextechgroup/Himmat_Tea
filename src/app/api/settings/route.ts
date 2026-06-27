import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          taxRate: 18,
          currency: '₹',
          storeName: 'Himmat Tea',
          storeEmail: 'support@himmattea.com',
          storePhone: '+91 9876543210',
          notificationsEnabled: true,
          lowStockThreshold: 30
        }
      })
    }
    
    return createResponse(settings)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const existingSettings = await prisma.settings.findFirst()
    
    let settings
    
    if (existingSettings) {
      settings = await prisma.settings.update({
        where: { id: existingSettings.id },
        data: body
      })
    } else {
      settings = await prisma.settings.create({
        data: body
      })
    }
    
    return createResponse(settings)
  } catch (error) {
    return handleApiError(error)
  }
}
