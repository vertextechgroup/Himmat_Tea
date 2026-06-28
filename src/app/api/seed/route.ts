import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createResponse, handleApiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

// Accept both GET and POST for easy seeding
export async function GET() {
  return POST();
}

export async function POST() {
  try {
    // Check if already seeded
    const existingAdmin = await prisma.adminUser.findFirst()
    if (existingAdmin) {
      return createResponse({ message: 'Database already seeded' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10)

    // Create admin user
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: 'admin@himmattea.com',
        passwordHash,
        role: 'superadmin',
        isActive: true
      }
    })

    // Create sample products
    const sampleProducts = await prisma.product.createMany({
      data: [
        {
          name: 'Premium Green Tea',
          category: 'Green Tea',
          price: 249,
          stock: 145,
          status: 'In Stock',
          description: 'Fresh organic green tea from Assam',
          imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
          sku: 'HMT-GRN-001',
          reorderPoint: 50,
          hasVariants: true
        },
        {
          name: 'Classic Black Tea',
          category: 'Black Tea',
          price: 229,
          stock: 234,
          status: 'In Stock',
          description: 'Traditional black tea blend',
          imageUrl: 'https://images.unsplash.com/photo-1564890369478-c6b8b91994ed?w=400&h=300&fit=crop',
          sku: 'HMT-BLK-001',
          reorderPoint: 60,
          hasVariants: false
        },
        {
          name: 'Herbal Collection',
          category: 'Herbal',
          price: 199,
          stock: 25,
          status: 'Low Stock',
          description: 'Natural herbal tea mix',
          imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
          sku: 'HMT-HRB-001',
          reorderPoint: 40,
          hasVariants: false
        },
        {
          name: 'Tea Ceremony Set',
          category: 'Accessories',
          price: 899,
          stock: 12,
          status: 'In Stock',
          description: 'Complete tea ceremony kit',
          imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
          sku: 'HMT-ACC-001',
          reorderPoint: 10,
          hasVariants: false
        },
        {
          name: 'Masala Chai Mix',
          category: 'Spiced',
          price: 299,
          stock: 56,
          status: 'In Stock',
          description: 'Authentic masala chai spice blend',
          imageUrl: 'https://images.unsplash.com/photo-1586374820345-f6339ae67f71?w=400&h=300&fit=crop',
          sku: 'HMT-MSL-001',
          reorderPoint: 35,
          hasVariants: false
        }
      ]
    })

    // Create sample customers
    const sampleCustomers = await prisma.customer.createMany({
      data: [
        {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+91 9876543210',
          address: '123 Tea Street, Mumbai',
          ordersCount: 14,
          totalSpent: 5231,
          loyaltyPoints: 523,
          tier: 'Silver'
        },
        {
          name: 'Michael Chen',
          email: 'michael@example.com',
          phone: '+91 9876543211',
          address: '456 Herbal Lane, Delhi',
          ordersCount: 9,
          totalSpent: 3499,
          loyaltyPoints: 350,
          tier: 'Bronze'
        },
        {
          name: 'Emma Williams',
          email: 'emma@example.com',
          phone: '+91 9876543212',
          address: '789 Green Tea Road, Bangalore',
          ordersCount: 23,
          totalSpent: 8921,
          loyaltyPoints: 892,
          tier: 'Gold'
        }
      ]
    })

    // Create settings
    await prisma.settings.create({
      data: {
        taxRate: 18,
        currency: '₹',
        storeName: 'Himmat Tea',
        storeEmail: 'support@himmattea.com',
        storePhone: '+91 9876543210',
        notificationsEnabled: true,
        lowStockThreshold: 30,
        gstNumber: '27AABCU9603R1ZX'
      }
    })

    return createResponse({
      message: 'Database seeded successfully!',
      products: sampleProducts.count,
      customers: sampleCustomers.count
    }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
