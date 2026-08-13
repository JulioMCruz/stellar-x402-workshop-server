import { copyFileSync, existsSync } from "node:fs";

const target = ".env.local";

if (existsSync(target)) {
  console.log(`[setup] ${target} already exists; nothing was overwritten.`);
} else {
  copyFileSync(".env.example", target);
  console.log(`[setup] Created ${target} from .env.example.`);
  console.log("[setup] Add PAY_TO and OPENZEPPELIN_API_KEY before continuing.");
}
