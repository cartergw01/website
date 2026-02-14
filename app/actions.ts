"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase";
import { embedText } from "@/lib/openai";

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return;
  const supabase = createServerSupabase();
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });
}

export async function saveInterests(formData: FormData) {
  const raw = String(formData.get("interests") || "");
  const interests = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 15);

  if (interests.length < 5) {
    throw new Error("Please add between 5 and 15 interests.");
  }

  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  await supabase.from("user_interests").delete().eq("user_id", user.id);

  const rows = [];
  for (const interest of interests) {
    const embedding = await embedText(interest);
    rows.push({ user_id: user.id, interest_text: interest, embedding });
  }

  await supabase.from("user_interests").insert(rows);
  redirect("/feed");
}
