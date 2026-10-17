import { NextResponse } from "next/server";
import {
  battleIdentity,
  battleView,
  battleAnswer,
  joinBattle,
} from "@/lib/battle";
import { failure, HttpError, jsonBody } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const identity = await battleIdentity(req),
      data = await battleView((await params).id, identity.id);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const identity = await battleIdentity(req),
      body = await jsonBody(req);
    let result;
    if (body.action === "join" && Object.keys(body).length === 1)
      await joinBattle((await params).id, identity.id);
    else if (
      body.action === "answer" &&
      typeof body.questionId === "string" &&
      Object.keys(body).every((k) =>
        ["action", "questionId", "selectedOption"].includes(k),
      )
    )
      result = await battleAnswer(
        (await params).id,
        identity.id,
        body.questionId,
        body.selectedOption,
      );
    else throw new HttpError(400, "Ação inválida.");
    const res = NextResponse.json(
      { success: true, result },
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
