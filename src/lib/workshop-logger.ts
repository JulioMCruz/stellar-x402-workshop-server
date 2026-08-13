type LogDetails = Record<string, string | number | boolean>;

export function workshopLog(requestId: string, step: string, details: LogDetails = {}) {
  const suffix = Object.entries(details)
    .map(([key, value]) => `${key}=${value}`)
    .join(" | ");

  console.log(`[x402 workshop][${requestId}] ${step}${suffix ? ` | ${suffix}` : ""}`);
}

export function workshopDivider(requestId: string, phase: "START" | "END", result?: string) {
  const outcome = result ? ` · ${result}` : "";
  console.log(`\n---------------- x402 REQUEST ${requestId} · ${phase}${outcome} ----------------`);
}

export function shortRequestId() {
  return crypto.randomUUID().slice(0, 8);
}
