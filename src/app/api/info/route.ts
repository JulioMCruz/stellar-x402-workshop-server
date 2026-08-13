import { NextResponse } from "next/server";
import { corsHeaders, optionsResponse } from "@/lib/cors";
import { publicConfig } from "@/lib/config";

export function GET() {
  return NextResponse.json(
    { name: "Stellar x402 Workshop API", protocol: "x402 v2", ...publicConfig() },
    { headers: corsHeaders() },
  );
}

export const OPTIONS = optionsResponse;
