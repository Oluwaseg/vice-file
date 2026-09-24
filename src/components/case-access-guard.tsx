"use client";

import { type ReactNode, useEffect, useState } from "react";

type CaseId = "case-001" | "case-002";

export function CaseAccessGuard({ requiredCase, children }: { requiredCase: CaseId; children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const progress = JSON.parse(window.localStorage.getItem(`vice-files:v1:${requiredCase}`) ?? "null") as { status?: string } | null;
      setAllowed(progress?.status === "complete");
    } catch {
      setAllowed(false);
    }
  }, [requiredCase]);

  if (allowed === null) return <main className="case-gate"><p>Checking clearance...</p></main>;
  if (!allowed) return <main className="case-gate"><p>Clearance required</p><h1>This file is still encrypted.</h1><span>Close the previous case before accessing this dossier.</span><a href={requiredCase === "case-001" ? "/cases/001" : "/cases/002"}>Return to active case</a></main>;
  return <>{children}</>;
}
