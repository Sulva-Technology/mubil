"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { submitContact } from "@/app/(site)/contact/actions";
import {
  HONEYPOT_FIELD,
  contactSchema,
  fieldErrors,
  type ContactErrors,
  type ContactField,
  type ContactState,
} from "@/lib/contact/schema";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { Glass } from "@/components/ui/Glass";

const empty = { name: "", email: "", phone: "", subject: "", message: "" };

type FieldProps = {
  name: ContactField;
  label: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
  multiline?: boolean;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/** Material-style floating label input. */
function Field({ name, label, type = "text", autoComplete, optional, multiline, value, error, onChange, onBlur }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const control = cn(
    "peer block w-full rounded-chip border bg-white/80 px-4 pb-2.5 pt-6 text-body text-ink outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent",
    "focus:border-brand focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]",
    error ? "border-error" : "border-line",
  );
  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder: label,
    autoComplete,
    required: !optional,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };
  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={5} className={cn(control, "resize-y min-h-[140px]")} />
        ) : (
          <input {...shared} type={type} className={control} />
        )}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-4 top-4 origin-left text-body text-ink-2 transition-all duration-300 ease-soft",
            "peer-focus:top-2 peer-focus:text-[0.75rem] peer-focus:text-brand",
            "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.75rem]",
          )}
        >
          {label}
          {optional && <span className="text-ink-2"> (optional)</span>}
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 pl-1 text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [lastState, setLastState] = useState(state);

  // Sync with the server result (render-time state adjustment).
  if (state !== lastState) {
    setLastState(state);
    if (state.status === "error" && state.fieldErrors) setErrors(state.fieldErrors);
    if (state.status === "success") {
      setValues(empty);
      setTouched({});
      setErrors({});
    }
  }

  useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);

  function validate(next: typeof values) {
    const result = contactSchema.safeParse(next);
    return result.success ? {} : fieldErrors(result.error);
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name as ContactField]) setErrors(validate(next));
  }

  function onBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name as ContactField;
    setTouched((t) => ({ ...t, [name]: true }));
    const all = validate(values);
    setErrors((prev) => ({ ...prev, [name]: all[name] }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const all = validate(values);
    if (Object.keys(all).length > 0) {
      e.preventDefault();
      setErrors(all);
      setTouched({ name: true, email: true, phone: true, subject: true, message: true });
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(all)[0]}"]`)?.focus();
    }
  }

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([k]) => touched[k as ContactField]),
  ) as ContactErrors;
  const success = state.status === "success" && !pending;
  const field = (name: ContactField) => ({ name, value: values[name], error: visibleErrors[name], onChange, onBlur });

  return (
    <Glass variant="strong" className="rounded-panel p-6 sm:p-8 md:p-10">
      <h2 className="font-display text-h3 font-semibold">Send us a message</h2>
      <p className="mt-1 text-small text-ink-2">Fields marked optional can be left blank.</p>

      <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field {...field("name")} label="Full name" autoComplete="name" />
          <Field {...field("email")} label="Email" type="email" autoComplete="email" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field {...field("phone")} label="Phone" type="tel" autoComplete="tel" optional />
          <Field {...field("subject")} label="Subject" />
        </div>
        <Field {...field("message")} label="Message" multiline />

        {/* Honeypot: hidden from people and assistive tech, irresistible to bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD}>Company website</label>
          <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite" className="min-h-6 text-small">
            {state.status === "error" && !pending && <p className="text-error">{state.message}</p>}
            {success && <p className="font-medium text-success">Message sent. We&apos;ll reply within two working days.</p>}
          </div>
          <motion.button
            type="submit"
            disabled={pending}
            layout
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full font-medium text-white transition-colors duration-500",
              success ? "w-12 bg-success" : "min-w-44 bg-brand px-7 hover:bg-brand-deep hover:shadow-glow",
              pending && "cursor-wait",
            )}
            aria-label={success ? "Message sent" : pending ? "Sending" : undefined}
          >
            <AnimatePresence mode="wait" initial={false}>
              {pending ? (
                <motion.span key="pending" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  <Loader2 aria-hidden className="size-5 animate-spin" />
                </motion.span>
              ) : success ? (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
                  <Check aria-hidden className="size-5" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Send message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </Glass>
  );
}
