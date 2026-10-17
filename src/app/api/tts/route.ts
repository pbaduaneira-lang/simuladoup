import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      error:
        "A leitura em voz alta agora usa a voz do navegador, sem cobrança.",
    },
    { status: 410 },
  );
}
