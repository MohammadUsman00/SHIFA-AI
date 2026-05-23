"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { getClientId } from "@/lib/client-id";
import { getActiveProfileId } from "@/lib/profiles";
import {
  getLocalCabinet,
  removeLocalCabinetItem,
  toggleLocalPurchased,
  type LocalCabinetItem,
} from "@/lib/local-cabinet";
import FamilyProfileBar from "./FamilyProfileBar";
import { bodyFontVar } from "@/lib/lang-ui";

function CabinetList({
  items,
  onToggle,
  onRemove,
}: {
  items: Array<LocalCabinetItem | { _id: Id<"cabinetItems">; medicineName: string; dosage?: string; timing?: string; purchased: boolean }>;
  onToggle: (id: string, purchased: boolean) => void;
  onRemove: (id: string) => void;
}) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);

  if (items.length === 0) {
    return (
      <p className="p-8 text-center text-sm text-[var(--text-4)]" style={{ fontFamily: f }}>
        {fc.cabinetEmpty}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {items.map((item) => {
        const id = "_id" in item ? String(item._id) : item.id;
        return (
          <li key={id} className="flex items-start gap-3 px-5 py-4">
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={(e) => onToggle(id, e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--primary)]"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[var(--text)]" style={{ fontFamily: f }}>
                {item.medicineName}
              </p>
              {"dosage" in item && item.dosage && (
                <p className="text-xs text-[var(--text-3)]" style={{ fontFamily: f }}>
                  {item.dosage}
                  {item.timing ? ` · ${item.timing}` : ""}
                </p>
              )}
            </div>
            <button type="button" className="btn-ghost p-2" onClick={() => onRemove(id)} aria-label="Remove">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MedicineCabinetLocal() {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [profileId, setProfileId] = useState("self");
  const [items, setItems] = useState<LocalCabinetItem[]>([]);

  const refresh = useCallback(() => setItems(getLocalCabinet(profileId)), [profileId]);

  useEffect(() => {
    setProfileId(getActiveProfileId());
    refresh();
  }, [refresh]);

  return (
    <CabinetShell fc={fc} f={f}>
      <FamilyProfileBar onProfileChange={(id) => { setProfileId(id); setItems(getLocalCabinet(id)); }} />
      <div className="cause-panel mt-4">
        <CabinetHeader fc={fc} />
        <CabinetList
          items={items}
          onToggle={(id, purchased) => {
            toggleLocalPurchased(id, purchased);
            refresh();
          }}
          onRemove={(id) => {
            removeLocalCabinetItem(id);
            refresh();
          }}
        />
      </div>
    </CabinetShell>
  );
}

function MedicineCabinetConvex() {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [profileId, setProfileId] = useState("self");
  const clientId = getClientId();
  const items = useQuery(api.queries.getCabinetItems, { clientId, profileId });
  const removeMutation = useMutation(api.mutations.removeCabinetItem);
  const toggleMutation = useMutation(api.mutations.toggleCabinetPurchased);

  useEffect(() => setProfileId(getActiveProfileId()), []);

  return (
    <CabinetShell fc={fc} f={f}>
      <FamilyProfileBar onProfileChange={setProfileId} />
      <div className="cause-panel mt-4">
        <CabinetHeader fc={fc} />
        {items === undefined ? (
          <p className="p-8 text-center text-sm text-[var(--text-4)]">…</p>
        ) : (
          <CabinetList
            items={items}
            onToggle={(id, purchased) => toggleMutation({ id: id as Id<"cabinetItems">, purchased })}
            onRemove={(id) => removeMutation({ id: id as Id<"cabinetItems"> })}
          />
        )}
      </div>
    </CabinetShell>
  );
}

function CabinetShell({ fc, f, children }: { fc: ReturnType<typeof featureCopy>; f: string; children: React.ReactNode }) {
  return (
    <section id="cabinet" className="scroll-mt-24">
      <div className="mb-6">
        <p className="royal-kicker mb-2">{fc.cabinet}</p>
        <h2 className="royal-title text-2xl sm:text-3xl" style={{ fontFamily: f }}>
          {fc.cabinet}
        </h2>
      </div>
      {children}
    </section>
  );
}

function CabinetHeader({ fc }: { fc: ReturnType<typeof featureCopy> }) {
  return (
    <div className="border-b border-[var(--border)] px-5 py-3" style={{ background: "var(--surface-2)" }}>
      <p className="text-xs font-semibold text-[var(--text-3)]">{fc.pharmacyChecklist}</p>
    </div>
  );
}

export default function MedicineCabinet({ hasConvex }: { hasConvex: boolean }) {
  if (hasConvex) return <MedicineCabinetConvex />;
  return <MedicineCabinetLocal />;
}
