import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const token = request.cookies.get('token');
	
	if(!token && request.nextUrl.pathname.startsWith('/dashboard')) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	const response = NextResponse.next()
	response.headers.set('x-path', request.nextUrl.pathname)
	return response
}

export const config = {
	matcher: ['/dashboard/:path', '/api/:path*']
}