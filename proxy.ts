import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "./utils/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/auth/callback"],
};
