import { NextResponse } from "next/server";
import { battleIdentity, newBattle } from "@/lib/battle";
import { failure, HttpError, jsonBody } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const body = await jsonBody(req);
    if (Object.keys(body).length) throw new HttpError(400, "Dados inválidos.");
    const identity = await battleIdentity(req),
      id = await newBattle(identity.id);
    const res = NextResponse.json(
      { id },
      { headers: { "Cache-Control": "no-store" } },
    );
    if (identity.cookie)
      res.cookies.set("up-battle", identity.cookie, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400,
        path: "/",
      });
    return res;
  } catch (e) {
    return failure(e);
  }
}
