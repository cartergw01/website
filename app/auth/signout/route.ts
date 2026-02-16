import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
