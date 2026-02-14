import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const sourceId = String(formData.get("sourceId"));
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/", request.url));

  await supabase.from("user_hidden_sources").upsert({ user_id: user.id, source_id: sourceId });
  return NextResponse.redirect(new URL("/feed", request.url));
}
