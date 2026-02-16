import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const clusterId = String(formData.get("clusterId"));
  const action = String(formData.get("action"));
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/", request.url));

  await supabase.from("user_feedback").insert({ user_id: user.id, cluster_id: clusterId, action });
  return NextResponse.redirect(new URL("/feed", request.url));
}
