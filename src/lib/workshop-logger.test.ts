import { describe, expect, it, vi } from "vitest";
import { workshopLog } from "./workshop-logger";

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
});
