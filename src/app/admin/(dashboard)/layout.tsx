import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";
import { getAdminContext } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTour } from "@/components/admin/AdminTour";
import { AuthCard } from "@/components/admin/AuthCard";
import { buttonClasses } from "@/components/ui/Button";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ctx = await getAdminContext();
  if (ctx.status === "signed-out") redirect("/admin/login");

  if (ctx.status === "not-admin") {
    return (
      <AuthCard title="Access not granted" intro={`${ctx.email ?? "This account"} is signed in but isn't an admin for this site.`}>
        <div className="flex items-start gap-3 rounded-card bg-ice p-4 text-small text-brand-deep">
          <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p>Ask the site owner to add your account as an admin, then sign in again.</p>
        </div>
        <form action={signOut} className="mt-6">
          <button type="submit" className={buttonClasses("secondary", "lg", "w-full")}>
            Sign out
          </button>
        </form>
      </AuthCard>
    );
  }

  const supabase = await createClient();
  const { count: unread } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false);

  return (
    <Suspense>
      <AdminShell name={ctx.name} email={ctx.email} unread={unread ?? 0}>
        {children}
      </AdminShell>
      <AdminTour autoStart={!ctx.tourCompleted} />
    </Suspense>
  );
}
