"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";

function ShareLinkConvex({ payload }: { payload: object }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const [status, setStatus] = useState<string | null>(null);
  const createShare = useMutation(api.mutations.createShareLink);

  const share = async () => {
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    try {
      await createShare({ token, payload: JSON.stringify(payload), expiresAt });
      const url = `${window.location.origin}/share/${token}`;
      await navigator.clipboard.writeText(url);
      setStatus(fc.shareCopied);
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("Failed");
    }
  };

  return (
    <button type="button" className="btn-ghost text-xs" onClick={share}>
      <Link2 className="h-3.5 w-3.5" />
      {status || fc.shareLink}
    </button>
  );
}

export default function ShareLinkButton({ payload, hasConvex }: { payload: object; hasConvex: boolean }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  if (!hasConvex) {
    return (
      <button type="button" className="btn-ghost text-xs opacity-60" title={fc.shareNeedsConvex} disabled>
        <Link2 className="h-3.5 w-3.5" />
        {fc.shareLink}
      </button>
    );
  }
  return <ShareLinkConvex payload={payload} />;
}
