import { NextResponse } from "next/server";
import { getHealthPayload } from "@/lib/api";

export function GET() {
  return NextResponse.json(getHealthPayload());
}
