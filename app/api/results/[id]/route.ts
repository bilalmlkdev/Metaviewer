import { NextRequest, NextResponse } from "next/server";
import { getResult } from "@/lib/store";

export const runtime = "nodejs";

const VALID_ID_REGEX = /^[a-zA-Z0-9]{6,20}$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || !VALID_ID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid result ID." }, { status: 400 });
  }

  const result = getResult(id);
  if (!result) {
    return NextResponse.json({ error: "Result not found." }, { status: 404 });
  }
  return NextResponse.json(result, { status: 200 });
}
