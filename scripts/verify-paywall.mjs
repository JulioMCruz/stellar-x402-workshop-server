const baseUrl = process.env.API_URL || "http://localhost:3000";
const response = await fetch(`${baseUrl}/api/premium-insight`);
const encoded = response.headers.get("payment-required");

if (response.status !== 402) throw new Error(`Expected 402, received ${response.status}`);
if (!encoded) throw new Error("PAYMENT-REQUIRED header is missing");
if (!response.headers.get("access-control-expose-headers")?.includes("PAYMENT-REQUIRED")) {
  throw new Error("Browser clients cannot read PAYMENT-REQUIRED through CORS");
}

const requirement = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
const accepted = requirement.accepts?.[0];
if (requirement.x402Version !== 2) throw new Error("Expected x402 v2");
if (accepted?.network !== "stellar:testnet") throw new Error("Expected Stellar Testnet");
if (accepted?.amount !== "10000") throw new Error("Expected $0.001 USDC (10000 base units)");
if (accepted?.extra?.areFeesSponsored !== true) throw new Error("Expected sponsored fees");

console.log(JSON.stringify({
  status: response.status,
  x402Version: requirement.x402Version,
  scheme: accepted.scheme,
  network: accepted.network,
  amount: accepted.amount,
  asset: accepted.asset,
  feesSponsored: accepted.extra.areFeesSponsored,
  corsExposesPaymentHeaders: true,
}, null, 2));
