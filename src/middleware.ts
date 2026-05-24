import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées (auth requise)
const PROTECTED = ['/dashboard', '/onboarding', '/settings', '/upgrade']
// Routes publiques (redirige si déjà connecté)
const AUTH_ROUTES = ['/login', '/auth/reset-password']

// Rate limiting basique en mémoire (par IP)
const rateMap = new Map<string, { count: number; reset: number }>()
function rateLimit(ip: string, max = 60, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs })
    return false // pas limité
  }
  entry.count++
  if (entry.count > max) return true // limité
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'

  // Rate limiting sur les API routes
  if (pathname.startsWith('/api/') && rateLimit(ip, 100, 60_000)) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    })
  }

  // Rate limiting strict sur l'auth
  if ((pathname.includes('/api/auth') || pathname === '/login') && rateLimit(`auth:${ip}`, 10, 60_000)) {
    return new NextResponse(JSON.stringify({ error: 'Too many attempts' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let response = NextResponse.next({ request: { headers: request.headers } })

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options } as any)
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options } as any)
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options } as any)
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options } as any)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthRoute = AUTH_ROUTES.some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
