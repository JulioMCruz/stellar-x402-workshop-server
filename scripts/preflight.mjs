const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value || /replace|your_/i.test(value)) throw new Error(`${name} is not configured in .env.local`);
  return value;
};

const network = required("STELLAR_NETWORK");
if (network !== "stellar:testnet") {
  throw new Error("Workshop preflight requires STELLAR_NETWORK=stellar:testnet");
}

const payTo = required("PAY_TO");
if (!/^G[A-Z2-7]{55}$/.test(payTo)) throw new Error("PAY_TO must be a public Stellar G-address");

const facilitator = required("FACILITATOR_URL");
if (facilitator !== "https://channels.openzeppelin.com/x402/testnet") {
  throw new Error("FACILITATOR_URL must use the OpenZeppelin Testnet endpoint");
}

required("OPENZEPPELIN_API_KEY");

console.log("[preflight] Server configuration is ready for Stellar Testnet.");
console.log("[preflight] PAY_TO is a public G-address and the API key is present.");
console.log("[preflight] No secret values were printed.");
