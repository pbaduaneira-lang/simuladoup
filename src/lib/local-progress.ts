"use client";
import type { StudyRecord } from "./types";
export function readProgress(userId = "guest"): StudyRecord[] {
  try {
    const data = JSON.parse(
      localStorage.getItem(`simuladoup:v2:${userId}`) || "[]",
    );
    return Array.isArray(data)
      ? data
          .filter(
            (r) =>
              r &&
              typeof r === "object" &&
              typeof r.key === "string" &&
              typeof r.questionId === "string" &&
              r.questionId.length <= 128 &&
              typeof r.materia === "string" &&
              typeof r.acertou === "boolean" &&
              typeof r.createdAt === "string" &&
              Number.isFinite(Date.parse(r.createdAt)),
          )
          .slice(-2000)
      : [];
  } catch {
    return [];
  }
}
export function saveProgress(record: StudyRecord, userId = "guest") {
  const previous = readProgress(userId);
  if (previous.some((r) => r.key === record.key)) return;
  try {
    localStorage.setItem(
      `simuladoup:v2:${userId}`,
      JSON.stringify([...previous, record].slice(-2000)),
    );
    window.dispatchEvent(new Event("study-updated"));
  } catch {
    /* Practice continues if browser storage is unavailable. */
  }
}
export function localStats(records: StudyRecord[]) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  return {
    total: records.length,
    correct: records.filter((r) => r.acertou).length,
    today: records.filter(
      (r) =>
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Sao_Paulo",
        }).format(new Date(r.createdAt)) === today,
    ).length,
  };
}
