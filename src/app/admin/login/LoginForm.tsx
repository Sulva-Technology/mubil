"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { buttonClasses } from "@/components/ui/Button";
import { authInput } from "@/components/admin/AuthCard";

type Mode = "login" | "forgot";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get("mode") === "forgot" ? "forgot" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "link" ? "That link has expired or was already used. Request a new one below." : null,
  );
  const [notice, setNotice] = useState<string | null>(params.get("reset") === "done" ? "Password updated. Sign in with your new password." : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setBusy(false);
        setError(error.message === "Invalid login credentials" ? "That email and password don't match. Try again." : error.message);
        return;
      }
      const next = params.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/reset-password`,
    });
    setBusy(false);
    if (error) setError(error.message);
    else setNotice("If that email has an admin account, a reset link is on its way. Check your inbox.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-small font-medium">
          Email
        </label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={authInput} />
      </div>

      {mode === "login" && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-small font-medium">
              Password
            </label>
            <button type="button" onClick={() => setMode("forgot")} className="rounded text-small font-medium text-brand hover:text-brand-deep">
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInput}
          />
        </div>
      )}

      <div aria-live="polite" className="text-small">
        {error && <p className="rounded-chip bg-[color-mix(in_srgb,var(--error)_10%,transparent)] px-3 py-2 text-error">{error}</p>}
        {notice && <p className="rounded-chip bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-3 py-2 text-[color-mix(in_srgb,var(--success)_70%,var(--ink))]">{notice}</p>}
      </div>

      <button type="submit" disabled={busy || !email || (mode === "login" && !password)} className={buttonClasses("primary", "lg", "w-full")}>
        {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {mode === "login" ? "Sign in" : "Send reset link"}
      </button>

      {mode === "forgot" && (
        <button type="button" onClick={() => setMode("login")} className={buttonClasses("tertiary", "md", "w-full justify-center")}>
          Back to sign in
        </button>
      )}
    </form>
  );
}
