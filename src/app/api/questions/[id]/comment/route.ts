import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json(
    {
      error:
        "Comentários públicos estão desativados nesta versão. Use o botão de revisão de questões.",
    },
    { status: 410 },
  );
}
export const POST = GET;
