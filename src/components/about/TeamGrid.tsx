"use client";

import Image from "@/components/ui/Img";
import { useCallback, useState } from "react";
import { Modal } from "@/components/ui/Modal";

type Member = { name: string; role: string; image: string; bio: string };

/** Portrait grid. Greyscale warms to colour on hover; click opens the bio. */
export function TeamGrid({ members }: { members: ReadonlyArray<Member> }) {
  const [active, setActive] = useState<Member | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.name}>
            <button
              type="button"
              onClick={() => setActive(member)}
              className="group block w-full rounded-card text-left"
              aria-haspopup="dialog"
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-card bg-ice">
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  sizes="(min-width: 1024px) 300px, 50vw"
                  className="object-cover grayscale transition-[filter,transform] duration-700 ease-soft group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0"
                />
              </span>
              <span className="mt-4 block font-display text-[1.125rem] font-semibold tracking-[-0.02em] md:text-[1.25rem]">
                {member.name}
              </span>
              <span className="mt-0.5 block text-small text-ink-2">{member.role}</span>
              <span className="mt-2 inline-block text-small font-medium text-brand">Read bio</span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={active !== null} onClose={close} title={active?.name ?? "Team member"}>
        {active && (
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-card">
              <Image src={active.image} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <p className="text-small font-medium text-brand">{active.role}</p>
              <p className="mt-3 text-ink-2">{active.bio}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
