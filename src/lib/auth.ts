import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

interface AuthPayload {
  id: number
  email: string
  type: 'customer' | 'admin'
}

export async function setAuthCookie(payload: AuthPayload): Promise<string> {
  const cookieStore = await cookies()
  const token = Buffer.from(JSON.stringify(payload)).toString('base64')

  cookieStore.set('himmat_sessionToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 4
  })
  cookieStore.set('himmat_isLoggedIn', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 4
  })

  return token
}

export async function getCurrentUser(): Promise<{ id: number; name?: string; email: string; username?: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('himmat_sessionToken')?.value

  if (!token) return null

  try {
    const payload: AuthPayload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))

    if (payload.type === 'customer') {
      const customer = await prisma.customer.findUnique({
        where: { id: payload.id }
      })
      if (!customer) return null
      return { id: customer.id, name: customer.name, email: customer.email }
    }

    if (payload.type === 'admin') {
      const admin = await prisma.adminUser.findUnique({
        where: { id: payload.id }
      })
      if (!admin) return null
      return { id: admin.id, username: admin.username, email: admin.email }
    }

    return null
  } catch {
    return null
  }
}
