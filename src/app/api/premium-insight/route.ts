import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { corsHeaders, optionsResponse } from "@/lib/cors";
import { shortRequestId, workshopLog } from "@/lib/workshop-logger";
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

const paidGET = withX402(
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

export async function GET(request: NextRequest) {
  const requestId = shortRequestId();
  const startedAt = performance.now();
  const hasPayment = request.headers.has("payment-signature");

  workshopLog(requestId, "1 · REQUEST RECEIVED", {
    method: request.method,
    resource: request.nextUrl.pathname,
  });

  if (hasPayment) {
    workshopLog(requestId, "2 · PAYMENT SIGNATURE RECEIVED", {
      signature: "hidden",
      facilitator: "OpenZeppelin",
    });
  }

  try {
    const response = await paidGET(request);
    const durationMs = Math.round(performance.now() - startedAt);

    if (response.status === 402) {
      workshopLog(requestId, "2 · HTTP 402 · PAYMENT REQUIRED", {
        price: "$0.001 USDC",
        network: config.network,
        durationMs,
      });
    } else if (response.ok && response.headers.has("payment-response")) {
      workshopLog(requestId, "3 · PAYMENT VERIFIED AND SETTLED", {
        facilitator: "OpenZeppelin",
        network: config.network,
        durationMs,
      });
      workshopLog(requestId, "4 · PROTECTED RESOURCE DELIVERED", {
        status: response.status,
      });
    } else {
      workshopLog(requestId, "PAYMENT FLOW ENDED WITHOUT SETTLEMENT", {
        status: response.status,
        durationMs,
      });
    }

    return response;
  } catch (error) {
    workshopLog(requestId, "PAYMENT FLOW ERROR", {
      error: error instanceof Error ? error.message : "unknown error",
      durationMs: Math.round(performance.now() - startedAt),
    });
    throw error;
  }
}

export const OPTIONS = optionsResponse;
