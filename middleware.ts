import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function middleware(req: any) {
  const { pathname } = new URL(req.url); // Extract the pathname from the URL

  // Check whether the user has a valid token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and accessing protected routes, redirect to home page
  if (
    !token &&
    (pathname.startsWith("/feed") || pathname.startsWith("/user") || pathname.startsWith("/me"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }


  // If token exists and accessing the home page, redirect to the feed page
  if (token && (pathname === "/" || pathname.startsWith("/auth/"))) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (token && pathname === "/me/settings"){
    return NextResponse.redirect(new URL("/me/settings/basicinfo", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/auth/:path*", "/user/:path*", "/me/:path*", "/"],
};
