"use client";

import { useState } from "react";
import { BookmarkPlus, Check } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { getClientId } from "@/lib/client-id";
import { getActiveProfileId } from "@/lib/profiles";
import { saveLocalCabinetItem } from "@/lib/local-cabinet";
import type { MedicineResult } from "@/types";

function savePayload(medicine: MedicineResult) {
  return {
    clientId: getClientId(),
    profileId: getActiveProfileId(),
    medicineName: medicine.name || medicine.nameUrdu,
    nameUrdu: medicine.nameUrdu,
    dosage: medicine.dosage,
    timing: medicine.timing,
    purpose: medicine.purpose,
  };
}

function SaveToCabinetLocal({ medicine }: { medicine: MedicineResult }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost text-xs"
      onClick={() => {
        saveLocalCabinetItem({ ...savePayload(medicine), purchased: false });
        setSaved(true);
      }}
      disabled={saved}
    >
      {saved ? <Check className="h-3.5 w-3.5 text-[var(--primary)]" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
      {saved ? fc.saved : fc.saveToCabinet}
    </button>
  );
}

function SaveToCabinetConvex({ medicine }: { medicine: MedicineResult }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const [saved, setSaved] = useState(false);
  const saveMutation = useMutation(api.mutations.saveCabinetItem);

  return (
    <button
      type="button"
      className="btn-ghost text-xs"
      onClick={async () => {
        try {
          await saveMutation(savePayload(medicine));
          setSaved(true);
        } catch {
          saveLocalCabinetItem({ ...savePayload(medicine), purchased: false });
          setSaved(true);
        }
      }}
      disabled={saved}
    >
      {saved ? <Check className="h-3.5 w-3.5 text-[var(--primary)]" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
      {saved ? fc.saved : fc.saveToCabinet}
    </button>
  );
}

export default function SaveToCabinetButton({
  medicine,
  hasConvex,
}: {
  medicine: MedicineResult;
  hasConvex: boolean;
}) {
  if (hasConvex) return <SaveToCabinetConvex medicine={medicine} />;
  return <SaveToCabinetLocal medicine={medicine} />;
}
