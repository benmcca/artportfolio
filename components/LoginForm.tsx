"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "../utils/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false,
      },
    });

    setIsSubmitting(false);
    setMessage(
      error
        ? "Unable to send the sign-in link. Check the email and try again."
        : "Check your email for the sign-in link.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block text-sm text-muted-foreground" htmlFor="email">
        Admin email
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded border border-sidebar-border bg-surface px-3 py-3 text-foreground outline-none transition focus:border-focus-ring focus:ring-2 focus:ring-focus-ring/30"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-sidebar-active px-4 py-3 text-sm font-bold text-sidebar-active-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send sign-in link"}
      </button>
      {message && (
        <p role="status" className="text-sm leading-6 text-muted-foreground">
          {message}
        </p>
      )}
    </form>
  );
}
