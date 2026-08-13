import { NextResponse } from "next/server";

export function corsHeaders(origin = process.env.CLIENT_ORIGIN || "http://localhost:3001") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, PAYMENT-SIGNATURE",
    "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
    Vary: "Origin",
  };
}

export function optionsResponse() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
