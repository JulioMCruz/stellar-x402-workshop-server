export const NETWORKS = {
  "stellar:testnet": {
    facilitatorUrl: "https://channels.openzeppelin.com/x402/testnet",
    usdcContract: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
  },
  "stellar:pubnet": {
    facilitatorUrl: "https://channels.openzeppelin.com/x402",
    usdcContract: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
  },
} as const;

export type StellarNetwork = keyof typeof NETWORKS;

export function getConfig(env: Record<string, string | undefined> = process.env) {
  const network = (env.STELLAR_NETWORK ?? "stellar:testnet") as StellarNetwork;
  if (!(network in NETWORKS)) {
    throw new Error("STELLAR_NETWORK must be stellar:testnet or stellar:pubnet");
  }

  const defaults = NETWORKS[network];
  const payTo = env.PAY_TO?.trim();
  const apiKey = env.OPENZEPPELIN_API_KEY?.trim();

  if (!payTo || !/^G[A-Z2-7]{55}$/.test(payTo)) {
    throw new Error("PAY_TO must be a valid public Stellar G-address");
  }
  if (!apiKey) throw new Error("OPENZEPPELIN_API_KEY is required");

  return {
    network,
    facilitatorUrl: env.FACILITATOR_URL?.trim() || defaults.facilitatorUrl,
    usdcContract: env.USDC_CONTRACT?.trim() || defaults.usdcContract,
    payTo,
    apiKey,
    clientOrigin: env.CLIENT_ORIGIN?.trim() || "http://localhost:3001",
  };
}

export function publicConfig(env: Record<string, string | undefined> = process.env) {
  const network = (env.STELLAR_NETWORK ?? "stellar:testnet") as StellarNetwork;
  if (!(network in NETWORKS)) throw new Error("Unsupported Stellar network");
  return {
    network,
    asset: "USDC",
    usdcContract: env.USDC_CONTRACT?.trim() || NETWORKS[network].usdcContract,
    price: "$0.001",
    route: "/api/premium-insight",
  };
}
