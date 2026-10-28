import { spawnSync } from "node:child_process";

const PREVIEW_BRANCH = "staging";
const currentBranch = process.env.WORKERS_CI_BRANCH;

if (currentBranch !== PREVIEW_BRANCH) {
  console.log(
    `[cloudflare] Preview deployment skipped: branch "${currentBranch ?? "unknown"}" is not "${PREVIEW_BRANCH}".`,
  );
  process.exit(0);
}

console.log(`[cloudflare] Deploying Preview for branch "${PREVIEW_BRANCH}".`);

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

run("pnpm run build");
run("pnpm exec wrangler preview");
