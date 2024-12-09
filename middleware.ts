import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function middleware(req:any) {
  const { pathname } = new URL(req.url); // Extract the pathname from the URL

  // Check whether the user has a valid token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and accessing protected routes, redirect to home page
  if (
    !token &&
    (pathname.startsWith("/settings") || pathname.startsWith("/feed"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token exists and accessing the home page, redirect to the feed page
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/feed/:path*", "/"], // Apply middleware to these routes
};
