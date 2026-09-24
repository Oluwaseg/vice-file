"use client";

import { useEffect, useState } from "react";

type CaseStatus = { status: "complete"; score: number } | null;
const baseRecords = [
  { id: "midnight-sentinel", type: "Vehicle", title: "Midnight Sentinel", summary: "Dark two-door coupe observed leaving the coastal route at 02:17.", status: "Linked to Case 001" },
  { id: "vice-beach", type: "Location", title: "Vice Beach", summary: "Coastal district. Traffic Camera 04 captured the exit route.", status: "Active surveillance" },
  { id: "ghost", type: "Person of interest", title: "The Ghost", summary: "Alias attached to the recovered device. Identity unconfirmed.", status: "Unidentified" },
];
const secondCaseRecords = [
  { id: "solstice-pier", type: "Location", title: "Solstice Pier", summary: "The next meeting point inferred from the recovered device.", status: "Linked to Case 002" },
  { id: "driver-profile", type: "Person of interest", title: "Missing Driver", summary: "The Ghost is now connected to the Midnight Sentinel route.", status: "Lead expanded" },
];
const finalCaseRecords = [
  { id: "velvet-circle", type: "Organization", title: "The Velvet Circle", summary: "The network coordinating the pier meeting, vehicle route, and recovered device.", status: "Exposed in Case 003" },
];

function isComplete(id: string) {
  try { return (JSON.parse(window.localStorage.getItem(`vice-files:v1:${id}`) ?? "null") as CaseStatus)?.status === "complete"; } catch { return false; }
}

export function IntelligenceDatabase() {
  const [caseOneDone, setCaseOneDone] = useState(false);
  const [caseTwoDone, setCaseTwoDone] = useState(false);
  const [caseThreeDone, setCaseThreeDone] = useState(false);
  useEffect(() => { setCaseOneDone(isComplete("case-001")); setCaseTwoDone(isComplete("case-002")); setCaseThreeDone(isComplete("case-003")); }, []);
  const records = caseThreeDone ? [...baseRecords, ...secondCaseRecords, ...finalCaseRecords] : caseTwoDone ? [...baseRecords, ...secondCaseRecords] : baseRecords;
  return <main className="database"><header className="database__header"><a href="/dashboard">Return to terminal</a><p>Vice Files / Intelligence database</p><h1>Known connections.</h1><span>{caseOneDone ? `${records.length.toString().padStart(2, "0")} records decrypted` : "Clearance required"}</span></header><section className="database__stats"><div><strong>{caseOneDone ? (caseTwoDone ? "02" : "01") : "00"}</strong><span>Suspects</span></div><div><strong>{caseOneDone ? "01" : "00"}</strong><span>Vehicles</span></div><div><strong>{caseOneDone ? (caseTwoDone ? "02" : "01") : "00"}</strong><span>Locations</span></div><div><strong>{caseThreeDone ? "03" : caseTwoDone ? "02" : "01"}</strong><span>Case files</span></div></section><section className="database__records">{caseOneDone ? records.map((record) => <article id={record.id} key={record.id}><span>{record.type}</span><h2>{record.title}</h2><p>{record.summary}</p><strong>{record.status}</strong></article>) : <div className="database__locked"><p>Encrypted records are unlocked by closing case files.</p><a href="/cases/001">Open Case 001</a></div>}</section></main>;
}
