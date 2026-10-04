import { spawnSync } from "node:child_process";

const IS_EXECUTE_DEPLOY = false;

function run(command) {
  const result = spawnSync(command, {
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(
      `[cloudflare] Failed to run command: ${result.error.message}`,
    );
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (IS_EXECUTE_DEPLOY) {
  run("pnpm run build && pnpm exec wrangler deploy");
} else {
  console.log("[cloudflare] Production deployment is intentionally disabled.");
  console.log(
    "[cloudflare] No build output was uploaded. Enable cf:deploy in package.json when the initial production release is approved.",
  );
}
