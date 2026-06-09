import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export class GhError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "GhError";
  }
}

export interface GhExecOptions {
  token?: string;
}

export async function checkGhAuth(token?: string): Promise<void> {
  try {
    await execGh(["auth", "status"], { token });
  } catch (error) {
    if (error instanceof GhError && error.message.includes("not logged")) {
      throw new GhError(
        "GitHub CLI is not authenticated. Run `gh auth login` or set GITHUB_TOKEN.",
      );
    }
    throw error;
  }
}

export async function execGh(
  args: string[],
  options: GhExecOptions = {},
): Promise<string> {
  const env: NodeJS.ProcessEnv = { ...process.env };

  if (options.token) {
    env.GH_TOKEN = options.token;
    env.GITHUB_TOKEN = options.token;
  }

  try {
    const { stdout } = await execFileAsync("gh", args, {
      env,
      maxBuffer: 50 * 1024 * 1024,
    });
    return stdout;
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      stderr?: string;
      code?: string;
    };
    const stderr = err.stderr ?? err.message ?? "Unknown gh error";
    const message = stderr.trim();

    if (message.includes("executable file not found") || err.code === "ENOENT") {
      throw new GhError(
        "GitHub CLI (`gh`) not found on PATH. Install from https://cli.github.com/",
      );
    }
    if (message.includes("401") || message.includes("Bad credentials")) {
      throw new GhError("GitHub authentication failed. Run `gh auth login`.");
    }
    if (message.includes("404") || message.includes("Not Found")) {
      throw new GhError("Repository not found or you lack access.");
    }
    if (message.includes("rate limit")) {
      throw new GhError("GitHub API rate limit exceeded. Try again later.");
    }

    throw new GhError(message.slice(0, 500));
  }
}

export async function ghApi<T>(
  endpoint: string,
  options: GhExecOptions = {},
): Promise<T[]> {
  // --jq '.[]' emits one JSON object per line across paginated pages
  const stdout = await execGh(
    ["api", endpoint, "--paginate", "--jq", ".[]"],
    options,
  );

  const trimmed = stdout.trim();
  if (!trimmed) {
    return [];
  }

  return trimmed
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}
