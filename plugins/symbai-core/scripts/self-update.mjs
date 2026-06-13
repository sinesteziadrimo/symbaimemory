#!/usr/bin/env node
// Auto-actualizare symbai-core — rulează la SessionStart (matcher "startup"), o dată la ~20h.
//
// Face `git pull --ff-only` în clona de marketplace a pluginului (instalat din GitHub =
// clonă git). Efectul se vede la URMĂTOAREA sesiune (pluginul se încarcă ÎNAINTE de hook).
//
// REGULĂ DE AUR: NU blochează și NU spamează niciodată startup-ul clientului — orice
// problemă (fără git, fără rețea, clonă divergentă, plugin instalat altfel) → exit 0 silențios.
// Stamp-ul de throttling stă în tmpdir, NU în arborele git (ca să nu murdărească repo-ul și
// să blocheze `--ff-only`).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

try {
  const root =
    process.env.CLAUDE_PLUGIN_ROOT ||
    dirname(dirname(fileURLToPath(import.meta.url))); // .../scripts/self-update.mjs → rădăcina pluginului
  const stamp = join(tmpdir(), "symbai-core-selfupdate.stamp");
  const THROTTLE_MS = 20 * 60 * 60 * 1000; // ~o dată pe zi

  let last = 0;
  try { last = Number(readFileSync(stamp, "utf8")) || 0; } catch { /* prima rulare */ }
  if (Date.now() - last < THROTTLE_MS) process.exit(0);

  // Marchează ÎNAINTE de pull: un pull lent/eșuat NU trebuie să reîncerce în fiecare sesiune.
  try { writeFileSync(stamp, String(Date.now())); } catch { /* ignoră */ }

  // ff-only = nedistructiv (nu rescrie istorie, nu face merge); timeout scurt; output suprimat.
  try {
    execFileSync("git", ["-C", root, "pull", "--ff-only", "--quiet"], {
      stdio: "ignore",
      timeout: 8000,
    });
  } catch { /* fără git / fără rețea / divergent → ignoră, rămâne pe versiunea curentă */ }
} catch { /* orice altceva → ignoră */ }

process.exit(0);
