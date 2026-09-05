import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("artwork")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ status: "error" }, { status: 503 });
    }

    return NextResponse.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
