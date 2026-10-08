"use client";

import Image from "@/components/ui/Img";
import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { compressImage } from "@/lib/admin/image";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  folder: "events" | "posts";
  value: string;
  onChange: (url: string) => void;
  invalid?: boolean;
};

/** Drop or pick a cover image. Compressed to WebP in the browser, then uploaded to the media bucket. */
export function ImageDropzone({ id, folder, value, onChange, invalid }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handle(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const blob = await compressImage(file);
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from("media").upload(path, blob, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (uploadError) throw new Error(uploadError.message);
      onChange(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    void handle(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void handle(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-card border border-line bg-ice">
          <div className="relative aspect-[16/9]">
            <Image src={value} alt="Cover preview" fill sizes="600px" className="object-cover" />
            {busy && (
              <div className="absolute inset-0 grid place-items-center bg-white/70">
                <Loader2 aria-hidden className="size-6 animate-spin text-brand-text" />
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-line bg-white p-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-small font-medium text-ink hover:bg-bg">
              <RefreshCw aria-hidden className="size-4" />
              Replace
            </button>
            <button type="button" onClick={() => onChange("")} className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-small font-medium text-error hover:bg-bg">
              <Trash2 aria-hidden className="size-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed bg-white px-6 text-center transition-colors",
            dragging ? "border-brand bg-ice" : invalid ? "border-error" : "border-line hover:border-brand/50",
          )}
        >
          {busy ? (
            <>
              <Loader2 aria-hidden className="size-6 animate-spin text-brand-text" />
              <span className="text-small text-ink-2">Compressing and uploading...</span>
            </>
          ) : (
            <>
              <span className="grid size-12 place-items-center rounded-full bg-ice text-brand-text">
                <ImagePlus aria-hidden className="size-6" strokeWidth={1.75} />
              </span>
              <span className="font-medium">Drop a photo here, or click to choose</span>
              <span className="text-small text-ink-2">JPG, PNG or WebP. We resize it for you.</span>
            </>
          )}
        </label>
      )}
      {error && (
        <p role="alert" className="mt-2 text-[0.8125rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
