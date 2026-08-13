import { spawn } from "node:child_process";
import path from "node:path";

const green = process.env.NO_COLOR ? "" : "\u001b[38;5;154m";
const cyan = process.env.NO_COLOR ? "" : "\u001b[36m";
const dim = process.env.NO_COLOR ? "" : "\u001b[2m";
const reset = process.env.NO_COLOR ? "" : "\u001b[0m";

console.log(`${green}
╔══════════════════════════════════════════════════════════════╗
║             STELLAR x402 WORKSHOP · SERVER                  ║
╚══════════════════════════════════════════════════════════════╝${reset}
${cyan}Role${reset}        Protected API and x402 resource server
${cyan}URL${reset}         http://localhost:3000
${cyan}Network${reset}     Stellar Testnet
${cyan}Payment${reset}     $0.001 USDC per protected request
${cyan}Facilitator${reset} OpenZeppelin

${dim}HTTP request → 402 challenge → payment verification → settlement → resource${reset}
${dim}Sensitive keys, signatures and encoded payment headers are never logged.${reset}
`);

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
