// Pure, framework-free helpers for opportunities.
// Kept separate from React components so they can be unit-tested directly.

export const STATUSES = [
  "Interested",
  "Preparing",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const DAY_MS = 86_400_000;

// Describe a deadline relative to `now` (defaults to today).
// Returns a human label and a tone used for styling ("", "soon", "overdue").
export function getDeadlineMeta(deadline, now = new Date()) {
  if (!deadline) {
    return { label: "No deadline", tone: "" };
  }

  const date = new Date(`${deadline}T00:00:00`);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const dayDifference = Math.round((date - today) / DAY_MS);
  const formatted = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(date);

  if (dayDifference < 0) {
    return { label: `${formatted} · overdue`, tone: "overdue" };
  }

  if (dayDifference === 0) {
    return { label: `${formatted} · today`, tone: "soon" };
  }

  if (dayDifference <= 7) {
    return { label: `${formatted} · ${dayDifference}d left`, tone: "soon" };
  }

  return { label: formatted, tone: "" };
}

// Filter a list of opportunities by a free-text search and an exact status.
// Search matches company, position, or notes (case-insensitive).
// An empty search / "All" status means "no filter".
export function filterOpportunities(opportunities, { search = "", status = "" } = {}) {
  const term = search.trim().toLowerCase();
  const wantedStatus = status.trim();

  return opportunities.filter((opportunity) => {
    if (wantedStatus && opportunity.status !== wantedStatus) {
      return false;
    }

    if (!term) {
      return true;
    }

    return [opportunity.company, opportunity.position, opportunity.notes]
      .some((field) => (field || "").toLowerCase().includes(term));
  });
}

// Count opportunities per status. Every known status is present (even if 0).
export function countByStatus(opportunities) {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));

  opportunities.forEach((opportunity) => {
    if (counts[opportunity.status] !== undefined) {
      counts[opportunity.status] += 1;
    }
  });

  return counts;
}
