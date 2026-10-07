import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard title="Sign in to manage the site" intro="Add events, publish news and read messages.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
