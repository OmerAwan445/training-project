'use server'

import { cookies } from 'next/headers'

// Types for better type safety
export type CookieOptions = {
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  domain?: string
}

export type UserSession = {
  id: string
  name: string
  email: string
  role?: string
}

// =============================================================================
// BASIC COOKIE OPERATIONS
// =============================================================================

/**
 * Set a cookie with optional configuration
 */
export async function setCookie(
  name: string, 
  value: string, 
  options: CookieOptions = {}
) {
  const cookieStore = await cookies()
  
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    ...options
  }

  try {
    cookieStore.set(name, value, defaultOptions)
    return { success: true, message: 'Cookie set successfully' }
  } catch (error) {
    console.error('Error setting cookie:', error)
    return { success: false, message: 'Failed to set cookie' }
  }
}

/**
 * Get a cookie value
 */
export async function getCookie(name: string): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(name)
    return cookie?.value || null
  } catch (error) {
    console.error('Error getting cookie:', error)
    return null
  }
}

/**
 * Delete a cookie
 */
export async function deleteCookie(name: string) {
  const cookieStore = await cookies()

  try {
    cookieStore.delete(name)
    return { success: true, message: 'Cookie deleted successfully' }
  } catch (error) {
    console.error('Error deleting cookie:', error)
    return { success: false, message: 'Failed to delete cookie' }
  }
}
