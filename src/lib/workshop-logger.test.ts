import { describe, expect, it, vi } from "vitest";
import { workshopDivider, workshopLog } from "./workshop-logger";

describe("workshop logger", () => {
  it("prints a readable event without sensitive payment material", () => {
    const output = vi.spyOn(console, "log").mockImplementation(() => undefined);

    workshopLog("abc12345", "2 · HTTP 402 · PAYMENT REQUIRED", {
      price: "$0.001 USDC",
      network: "stellar:testnet",
    });

    expect(output).toHaveBeenCalledWith(
      "[x402 workshop][abc12345] 2 · HTTP 402 · PAYMENT REQUIRED | price=$0.001 USDC | network=stellar:testnet",
    );
    expect(output.mock.calls.flat().join(" ")).not.toMatch(/signature|api.?key/i);
    output.mockRestore();
  });

  it("visually separates each request flow", () => {
    const output = vi.spyOn(console, "log").mockImplementation(() => undefined);

    workshopDivider("abc12345", "START");
    workshopDivider("abc12345", "END", "HTTP 402");

    expect(output).toHaveBeenNthCalledWith(
      1,
      "\n---------------- x402 REQUEST abc12345 · START ----------------",
    );
    expect(output).toHaveBeenNthCalledWith(
      2,
      "\n---------------- x402 REQUEST abc12345 · END · HTTP 402 ----------------",
    );
    output.mockRestore();
  });
});
