import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Use o formulário de criação de conta." },
    { status: 410 },
  );
}
