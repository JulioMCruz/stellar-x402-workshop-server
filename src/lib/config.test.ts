import { describe, expect, it } from "vitest";
import { getConfig, NETWORKS, publicConfig } from "./config";

const address = "G" + "A".repeat(55);

describe("network configuration", () => {
  it("uses the official OpenZeppelin testnet facilitator and USDC contract", () => {
    const config = getConfig({ PAY_TO: address, OPENZEPPELIN_API_KEY: "key" });
    expect(config.network).toBe("stellar:testnet");
    expect(config.facilitatorUrl).toBe("https://channels.openzeppelin.com/x402/testnet");
    expect(config.usdcContract).toBe(NETWORKS["stellar:testnet"].usdcContract);
  });

  it("switches every default to mainnet explicitly", () => {
    const config = getConfig({
      STELLAR_NETWORK: "stellar:pubnet",
      PAY_TO: address,
      OPENZEPPELIN_API_KEY: "key",
    });
    expect(config.facilitatorUrl).toBe("https://channels.openzeppelin.com/x402");
    expect(config.usdcContract).toBe(NETWORKS["stellar:pubnet"].usdcContract);
  });

  it("never exposes the facilitator API key", () => {
    expect(JSON.stringify(publicConfig({ OPENZEPPELIN_API_KEY: "secret" }))).not.toContain("secret");
  });
});
