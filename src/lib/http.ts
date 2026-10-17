import { NextResponse } from "next/server";
import { getAuth } from "./auth";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const expectedOrigin = new URL(process.env.BETTER_AUTH_URL || req.url).origin;
  if (origin && origin !== expectedOrigin)
    throw new HttpError(403, "Origem não permitida.");
  if (req.headers.get("sec-fetch-site") === "cross-site")
    throw new HttpError(403, "Origem não permitida.");
}
export async function jsonBody(req: Request) {
  assertSameOrigin(req);
  if (Number(req.headers.get("content-length") || 0) > 20000)
    throw new HttpError(413, "Conteúdo muito longo.");
  const raw = await req.text();
  if (raw.length > 20000) throw new HttpError(413, "Conteúdo muito longo.");
  try {
    const body = JSON.parse(raw);
    if (!body || Array.isArray(body) || typeof body !== "object") throw Error();
    return body as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "Dados inválidos.");
  }
}
export async function currentUser(req: Request) {
  // A public guest request does not depend on an authentication/database service.
  if (!req.headers.get("cookie")?.includes("better-auth.")) return null;
  const session = await (
    await getAuth()
  ).api.getSession({ headers: req.headers });
  return session?.user || null;
}
export async function requireUser(req: Request) {
  const user = await currentUser(req);
  if (!user) throw new HttpError(401, "Entre na sua conta para continuar.");
  return user;
}
export function failure(error: unknown) {
  if (error instanceof HttpError)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status },
    );
  console.error(
    "Serviço indisponível:",
    error instanceof Error ? error.name : "Error",
  );
  return NextResponse.json(
    {
      success: false,
      error:
        "Não foi possível acessar sua conta agora. Você pode continuar estudando sem conta.",
    },
    { status: 503 },
  );
}
export function noStore<T>(body: T) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
