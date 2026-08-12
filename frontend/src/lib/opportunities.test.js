import { describe, expect, it } from "vitest";
import {
  STATUSES,
  countByStatus,
  filterOpportunities,
  getDeadlineMeta,
} from "./opportunities";

const sample = [
  { id: 1, company: "Google", position: "SWE Intern", status: "Applied", notes: "Referral from Sam" },
  { id: 2, company: "OpenAI", position: "Research Scholar", status: "Interview", notes: "" },
  { id: 3, company: "Acme Labs", position: "Data Analyst", status: "Applied", notes: "Remote role" },
];

describe("filterOpportunities", () => {
  it("returns everything when no filters are set", () => {
    expect(filterOpportunities(sample, {})).toHaveLength(3);
  });

  it("filters by status", () => {
    const result = filterOpportunities(sample, { status: "Applied" });
    expect(result.map((o) => o.id)).toEqual([1, 3]);
  });

  it("searches company, position, and notes case-insensitively", () => {
    expect(filterOpportunities(sample, { search: "google" }).map((o) => o.id)).toEqual([1]);
    expect(filterOpportunities(sample, { search: "analyst" }).map((o) => o.id)).toEqual([3]);
    expect(filterOpportunities(sample, { search: "referral" }).map((o) => o.id)).toEqual([1]);
  });

  it("combines search and status", () => {
    const result = filterOpportunities(sample, { search: "remote", status: "Applied" });
    expect(result.map((o) => o.id)).toEqual([3]);
  });

  it("returns no results when nothing matches", () => {
    expect(filterOpportunities(sample, { search: "nonexistent" })).toHaveLength(0);
  });
});

describe("countByStatus", () => {
  it("counts each status and includes zeros for the rest", () => {
    const counts = countByStatus(sample);
    expect(counts.Applied).toBe(2);
    expect(counts.Interview).toBe(1);
    expect(counts.Offer).toBe(0);
    expect(Object.keys(counts)).toEqual(STATUSES);
  });
});

describe("getDeadlineMeta", () => {
  const now = new Date("2026-08-12T09:00:00");

  it("labels missing deadlines", () => {
    expect(getDeadlineMeta("", now)).toEqual({ label: "No deadline", tone: "" });
  });

  it("marks a past deadline as overdue", () => {
    expect(getDeadlineMeta("2026-08-01", now).tone).toBe("overdue");
  });

  it("marks today's deadline as soon", () => {
    const meta = getDeadlineMeta("2026-08-12", now);
    expect(meta.tone).toBe("soon");
    expect(meta.label).toContain("today");
  });

  it("marks a deadline within a week as soon", () => {
    const meta = getDeadlineMeta("2026-08-16", now);
    expect(meta.tone).toBe("soon");
    expect(meta.label).toContain("4d left");
  });

  it("leaves a far-off deadline untoned", () => {
    expect(getDeadlineMeta("2026-12-01", now).tone).toBe("");
  });
});
