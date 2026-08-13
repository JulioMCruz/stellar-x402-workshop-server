import { HTTPFacilitatorClient } from "@x402/core/server";
import { x402ResourceServer } from "@x402/next";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { getConfig } from "./config";

export function createResourceServer() {
  const config = getConfig();
  const auth = { Authorization: `Bearer ${config.apiKey}` };
  const facilitator = new HTTPFacilitatorClient({
    url: config.facilitatorUrl,
    createAuthHeaders: async () => ({ verify: auth, settle: auth, supported: auth }),
  });

  return {
    config,
    server: new x402ResourceServer(facilitator).register(
      config.network,
      new ExactStellarScheme(),
    ),
  };
}
