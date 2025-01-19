import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("Middleware is running1111!"); // Should print in the terminal

  // Example logic
  const token = req.cookies.get("authToken");
  if (!token) {
    console.log("No token found. Redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return new Response("Middleware executed successfully", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });

  // return NextResponse.next(); // Proceed to the next handler
}

export const config = {
  matcher: ["/"], // Matches all routes
};
