"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import {
  addProfile,
  getActiveProfileId,
  getProfiles,
  setActiveProfileId,
  type FamilyProfile,
} from "@/lib/profiles";

interface Props {
  onProfileChange: (id: string) => void;
}

export default function FamilyProfileBar({ onProfileChange }: Props) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [active, setActive] = useState("self");

  useEffect(() => {
    setProfiles(getProfiles());
    const id = getActiveProfileId();
    setActive(id);
    onProfileChange(id);
  }, [onProfileChange]);

  const select = (id: string) => {
    setActiveProfileId(id);
    setActive(id);
    onProfileChange(id);
  };

  const add = () => {
    const name = prompt(fc.addMember);
    if (!name?.trim()) return;
    const p = addProfile(name.trim());
    setProfiles(getProfiles());
    select(p.id);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="royal-kicker text-[10px]">{fc.familyProfile}</span>
      {profiles.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => select(p.id)}
          className="pill text-xs"
          style={
            active === p.id
              ? { borderColor: "var(--gold)", background: "var(--accent-subtle)", color: "var(--navy)" }
              : undefined
          }
        >
          {p.name}
        </button>
      ))}
      <button type="button" className="btn-ghost text-xs" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        {fc.addMember}
      </button>
    </div>
  );
}
