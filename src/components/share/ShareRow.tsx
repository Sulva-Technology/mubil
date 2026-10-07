"use client";

import { Link2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { SocialIcon } from "@/components/icons/SocialIcon";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9.2 8.6c.2-.4.6-.5.9-.4l.6 1.5c.1.3 0 .5-.2.7l-.5.5a5.4 5.4 0 0 0 2.9 2.9l.5-.5c.2-.2.4-.3.7-.2l1.5.6c.3.1.4.5.3.8-.4.9-1.4 1.3-2.3 1-2.4-.7-4.3-2.6-5-5-.2-.6 0-1.3.6-1.9z" />
    </svg>
  );
}

const itemClass =
  "grid size-11 place-items-center rounded-full border border-line bg-surface text-ink-2 transition-[color,transform,box-shadow] duration-500 ease-soft hover:-translate-y-0.5 hover:text-brand hover:shadow-card";

/** WhatsApp, X, Facebook and copy link. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const { toast } = useToast();
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch {
      toast("Couldn't copy the link. Copy it from the address bar instead.", "error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mr-1 text-small font-medium text-ink-2">Share</span>
      <a className={itemClass} href={`https://wa.me/?text=${text}%20${link}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
        <WhatsAppIcon className="size-5" />
      </a>
      <a className={itemClass} href={`https://x.com/intent/post?text=${text}&url=${link}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <SocialIcon network="x" className="size-5" />
      </a>
      <a className={itemClass} href={`https://www.facebook.com/sharer/sharer.php?u=${link}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <SocialIcon network="facebook" className="size-5" />
      </a>
      <button type="button" className={itemClass} onClick={copy} aria-label="Copy link">
        <Link2 aria-hidden className="size-5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
