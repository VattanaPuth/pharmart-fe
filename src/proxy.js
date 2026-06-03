//middleware.js
import { NextResponse } from "next/server";



function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;



  // 🔓 PUBLIC ROUTES (no auth at all)
  const publicRoutes = [
    "/login",
    "/registration",
    "/public",
    "/test",
  ];

  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  //  NO TOKEN → LOGIN
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = parseJwt(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = decoded.role;
  const ekycStatus = decoded.ekyc_status;
  
  console.log("proxy decode ekyc status: ", decoded.ekyc_status)

const onboarding =
  role === "CUSTOMER" || role === "OWNER"
    ? decoded.onboarding === true ||
      decoded.onboarding === "true" ||
      decoded.onboarding === 1 ||
      decoded.onboarding === "1"
    : true;

    console.log("decoded:", decoded);
console.log("onboarding:", decoded.onboarding);
console.log("type:", typeof decoded.onboarding);
  // const onboarding = decoded.onboarding ?? false;
  
  

  //  STEP 1: FORCE ROLE + ONBOARDING FLOW FIRST
  const isAuthFlow =
    pathname.startsWith("/registration") ||
    pathname.startsWith("/login");

  if (isAuthFlow) {
    return NextResponse.next();
  }

  // 🚨 STEP 2: BLOCK UNFINISHED USERS FROM APP
  const isAppRoute =
    pathname.startsWith("/owner") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/admin");

  if (isAppRoute && !onboarding) {
    return NextResponse.redirect(
      new URL("/registration", request.url)
    );
  }

  //  OWNER
if (pathname.startsWith("/owner")) {
    if (role !== "OWNER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    //  eKYC Check: If not approved and trying to leave the dashboard
    const isDashboard = pathname === "/owner/dashboard";
    if (ekycStatus !== "approved" && !isDashboard) {
      const url = new URL("/owner/dashboard", request.url);
      url.searchParams.set("error", "ekyc_unapproved"); // Trigger for toastify
      return NextResponse.redirect(url);
    }
  }

  //  CUSTOMER
  if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //  ADMIN
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/owner/:path*",
    "/customer/:path*",
    "/admin/:path*",
    "/login",
    "/registration",
    "/test/:path*",
  ],
};