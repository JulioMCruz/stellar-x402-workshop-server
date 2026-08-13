import { describe, expect, it } from "vitest";
import { corsHeaders, optionsResponse } from "./cors";
import nextConfig from "../../next.config";

describe("x402 CORS", () => {
  it("allows the headers sent by the browser payment client", () => {
    const headers = corsHeaders("http://localhost:3001");

    expect(headers["Access-Control-Allow-Headers"]).toContain("PAYMENT-SIGNATURE");
    expect(headers["Access-Control-Allow-Headers"]).toContain("Access-Control-Expose-Headers");
    expect(headers["Access-Control-Expose-Headers"]).toContain("PAYMENT-REQUIRED");
    expect(headers["Access-Control-Expose-Headers"]).toContain("PAYMENT-RESPONSE");
  });

  it("returns the browser origin and CORS policy in the preflight response", () => {
    const response = optionsResponse();

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:3001");
    expect(response.headers.get("access-control-allow-headers")?.toLowerCase()).toContain(
      "access-control-expose-headers",
    );
  });

  it("keeps the Next.js API header policy compatible with the route preflight", async () => {
    const configured = await nextConfig.headers?.();
    const apiHeaders = configured?.find((entry) => entry.source === "/api/:path*")?.headers;
    const allowed = apiHeaders?.find((header) => header.key === "Access-Control-Allow-Headers")?.value;

    expect(allowed).toContain("PAYMENT-SIGNATURE");
    expect(allowed).toContain("Access-Control-Expose-Headers");
  });
});
