import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "Inicie uma nova tentativa em /api/questions." },
    { status: 410 },
  );
}
