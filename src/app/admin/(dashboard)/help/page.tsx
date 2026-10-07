import type { Metadata } from "next";
import { HelpCenter } from "@/components/admin/HelpCenter";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return <HelpCenter />;
}
