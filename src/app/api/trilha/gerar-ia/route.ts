import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      error:
        "A trilha agora é calculada a partir do seu histórico, sem serviço pago de IA. Use /api/trilha.",
    },
    { status: 410 },
  );
}
