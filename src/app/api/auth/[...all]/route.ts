import { getAuth } from "@/lib/auth";
import { assertSameOrigin, failure } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    return await (await getAuth()).handler(req);
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    return await (await getAuth()).handler(req);
  } catch (e) {
    return failure(e);
  }
}
