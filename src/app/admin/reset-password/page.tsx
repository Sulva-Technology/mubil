"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { AuthCard, authInput } from "@/components/admin/AuthCard";
import { buttonClasses } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 10) return setError("Use at least 10 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setBusy(false);
      setError(
        error.message.includes("session")
          ? "This reset link has expired. Request a new one from the sign-in page."
          : error.message,
      );
      return;
    }
    await supabase.auth.signOut();
    router.replace("/admin/login?reset=done");
  }

  return (
    <AuthCard title="Choose a new password" intro="Use at least 10 characters. A short sentence works well.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-small font-medium">
            New password
          </label>
          <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={authInput} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-small font-medium">
            Confirm new password
          </label>
          <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={authInput} />
        </div>
        <p aria-live="polite" className="min-h-5 text-small text-error">
          {error}
        </p>
        <button type="submit" disabled={busy} className={buttonClasses("primary", "lg", "w-full")}>
          {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
          Update password
        </button>
      </form>
    </AuthCard>
  );
}
