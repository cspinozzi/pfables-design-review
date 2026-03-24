import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // This is a simple middleware for demonstration
  // In a real app, you'd check auth tokens from cookies
  return NextResponse.next()
}

export const config = {
  matcher: ["/browse/:path*", "/provider/:path*", "/admin/:path*", "/messages/:path*"],
}
