const codes = new Set([
  "SERVER_ERROR",
  "HRANA_WEBSOCKET_ERROR",
  "HRANA_PROTO_ERROR",
  "URL_INVALID",
  "URL_SCHEME_NOT_SUPPORTED",
  "AUTH_TOKEN_NOT_SUPPORTED",
  "SQLITE_ERROR",
  "SQLITE_AUTH",
  "SQLITE_READONLY",
  "SQLITE_BUSY",
  "SQLITE_CONSTRAINT",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "ENOTFOUND",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "MODULE_NOT_FOUND",
  "ERR_MODULE_NOT_FOUND",
  "ERR_DLOPEN_FAILED",
]);
/** @param {unknown} error @param {Record<string, string | undefined>} env */
export function serviceDiagnostic(error, env = process.env) {
  const issues = [];
  for (const key of [
    "TURSO_DATABASE_URL",
    "TURSO_AUTH_TOKEN",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ]) {
    const value = env[key];
    if (!value) issues.push(`${key}_MISSING`);
    else if (value !== value.trim())
      issues.push(`${key}_SURROUNDING_WHITESPACE`);
  }
  if (env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length < 32)
    issues.push("BETTER_AUTH_SECRET_TOO_SHORT");
  for (const [key, protocols] of [
    ["TURSO_DATABASE_URL", ["libsql:", "https:"]],
    ["BETTER_AUTH_URL", ["https:", "http:"]],
  ]) {
    const value = env[key];
    if (!value) continue;
    try {
      const url = new URL(value);
      if (
        !protocols.includes(url.protocol) ||
        !url.hostname ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        (url.pathname !== "/" && url.pathname !== "")
      )
        issues.push(`${key}_INVALID`);
    } catch {
      issues.push(`${key}_INVALID`);
    }
  }
  const causes = [];
  let current = error;
  for (let i = 0; current && typeof current === "object" && i < 4; i++) {
    const item = /** @type {Record<string, unknown>} */ (current);
    const code =
      typeof item.code === "string" && codes.has(item.code)
        ? item.code
        : "UNCLASSIFIED";
    const status =
      typeof item.status === "number" &&
      Number.isInteger(item.status) &&
      item.status >= 100 &&
      item.status < 600
        ? item.status
        : undefined;
    causes.push({ code, ...(status ? { status } : {}) });
    current = item.cause;
  }
  return { event: "SIMULADOUP_ACCOUNT_SERVICE_FAILURE", issues, causes };
}
