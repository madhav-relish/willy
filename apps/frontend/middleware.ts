import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken2")?.value; 

  // If no token, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Verify the token by making a request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";
    const verifyRes = await fetch(`${backendUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!verifyRes.ok) {
      console.log( verifyRes.status)
      throw new Error("Invalid token");
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

// ✅ Apply middleware to protected routes only
export const config = {
  matcher: ["/chat/:path*", "/profile/:path*", "/"], 
};
