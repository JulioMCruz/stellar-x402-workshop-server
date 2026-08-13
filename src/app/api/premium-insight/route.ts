import { NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { corsHeaders, optionsResponse } from "@/lib/cors";
import { createResourceServer } from "@/lib/x402";

const { config, server } = createResourceServer();

async function handler() {
  return NextResponse.json(
    {
      insight: "Los agentes pueden comprar servicios por petición usando HTTP y USDC.",
      example: "Un agente paga por datos, otro los analiza y un tercero ejecuta una acción.",
      paid: true,
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders(config.clientOrigin) },
  );
}

export const GET = withX402(
  handler,
  {
    accepts: {
      scheme: "exact",
      price: "$0.001",
      network: config.network,
      payTo: config.payTo,
    },
    description: "Workshop premium insight paid with USDC on Stellar",
    mimeType: "application/json",
  },
  server,
);

export const OPTIONS = optionsResponse;
