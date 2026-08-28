import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Plain .mjs (same pattern as tracker-table.mjs/clean-chips.mjs) so
// tests/lib/spawn-cli.test.mjs can import it directly under Node. Import it with the
// .mjs extension included (e.g. "@/lib/spawn-cli.mjs") — unlike .ts files,
// which TypeScript resolves without an extension, ESM specifiers for plain
// JS modules must be fully specified.

/**
 * Extract the Node entrypoint from a standard npm `cmd-shim` (Windows).
 *
 * npm installs a global bin as three sibling files: an extensionless bash
 * shim, `bin.cmd` and `bin.ps1`. `child_process.spawn()` without a shell
 * cannot execute ANY of them directly — a `.cmd` needs cmd.exe, and the
 * extensionless shim is a shebang text file CreateProcess refuses. The
 * reliable path is to read the shim's final line and spawn `node.exe` with
 * the real package entrypoint instead:
 *
 *   endLocal & goto #_undefined_# 2>NUL || title %COMSPEC% & "%_prog%"  "%dp0%\node_modules\opencode\bin" %*
 *
 * The shim also quotes `"%dp0%\node.exe"` for its node probe, so the LAST
 * `%dp0%`-relative entry that begins with `node_modules` wins.
 *
 * @param {string} shimText content of the `.cmd` shim
 * @returns {string|null} package-relative entrypoint (e.g. `node_modules\opencode\bin`), or null
 */
export function parseShimTarget(shimText) {
  const re = /"%dp0%\\+([^"]*)"/gi;
  let rel = null;
  let m;
  while ((m = re.exec(shimText))) {
    const candidate = m[1].replaceAll("/", "\\").trim();
    if (candidate.startsWith("node_modules")) rel = candidate;
  }
  return rel;
}

/**
 * Resolve a Windows `.cmd`/`.bat` shim to `{ bin, args }` when it is a
 * standard npm cmd-shim, so `spawnHeadlessCli` can run it as
 * `node <entrypoint> <originalArgs>`. Returns null on any non-npm shim or
 * resolution failure — callers keep their existing (pre-fix) behavior then,
 * so this never hard-breaks a currently-working launch.
 *
 * Deliberately NOT using `shell: true`: the web's prompts are built from
 * untrusted input (job postings, form answers), and shell mode would make
 * that content executable on the user's machine.
 *
 * @param {string} binPath
 * @returns {{ bin: string, args: string[] } | null}
 */
export function resolveWindowsShim(binPath) {
  if (process.platform !== "win32") return null;
  if (!/\.(cmd|bat)$/i.test(binPath)) return null;
  let text;
  try {
    text = fs.readFileSync(binPath, "utf8");
  } catch {
    return null;
  }
  const rel = parseShimTarget(text);
  if (!rel) return null;
  const target = path.resolve(path.dirname(binPath), rel);
  try {
    fs.accessSync(target, fs.constants.R_OK);
  } catch {
    return null;
  }
  return { bin: process.execPath, args: [target] };
}

/**
 * Spawn a headless agent CLI with stdin closed.
 *
 * CLIs such as `codex exec` read additional prompt text from stdin when a pipe
 * is left open. A web request never supplies that extra input, so leaving the
 * default pipe open makes Codex wait forever without producing stdout. This is
 * the ONLY spawn path for CLI-invoking routes — every call site should use it
 * instead of `node:child_process`'s `spawn` directly, so the fix can't drift.
 *
 * It also replaces the `stdio: ["ignore", ...]` the apply planners used to spell
 * for the same reason — one mechanism means one place for this to be right.
 * The options type omits `stdio` on purpose: stdout/stderr must stay pipes for
 * every caller's stream handlers, and TypeScript keeps `child.stdout` non-null
 * only under that contract. `stdin` is still optional-chained so an untyped
 * caller passing `stdio` anyway degrades safely (null stdin) instead of throwing.
 *
 * On Windows, npm-global CLIs (`opencode`, `claude`, `codex` shims…) are
 * spawned through their resolved Node entrypoint (see resolveWindowsShim),
 * because spawn without a shell cannot execute `.cmd`/`.bat` shims.
 *
 * @param {string} binPath
 * @param {string[]} args
 * @param {import("node:child_process").SpawnOptionsWithoutStdio} options
 */
export function spawnHeadlessCli(binPath, args, options) {
  const shim = resolveWindowsShim(binPath);
  const bin = shim ? shim.bin : binPath;
  const argv = shim ? [...shim.args, ...args] : args;
  const child = spawn(bin, argv, options);
  child.stdin?.end();
  return child;
}
