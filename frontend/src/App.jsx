import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, authApi, opportunityApi } from "./api";

const SESSION_KEY = "opportunityos.credentials";

const STATUSES = [
  "Interested",
  "Preparing",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const EMPTY_FORM = {
  company: "",
  position: "",
  status: "Interested",
  deadline: "",
  link: "",
};

function readStoredCredentials() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY));

    if (
      typeof stored?.username === "string" &&
      typeof stored?.password === "string"
    ) {
      return stored;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }

  return null;
}

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    external: (
      <>
        <path d="M15 4h5v5" />
        <path d="m10 14 10-10" />
        <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    calendar: (
      <>
        <path d="M5 3v3M19 3v3" />
        <path d="M4 5h16a1 1 0 0 1 1 1v14H3V6a1 1 0 0 1 1-1Z" />
        <path d="M3 10h18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function BrandMark() {
  return (
    <div className="brand" aria-label="OpportunityOS">
      <span className="brand-mark" aria-hidden="true">
        O<span>+</span>
      </span>
      <span className="brand-word">
        Opportunity<span>OS</span>
      </span>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";

  function changeMode(nextMode) {
    setMode(nextMode);
    setFeedback(null);
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const credentials = {
      username: username.trim(),
      password,
    };

    try {
      if (isLogin) {
        await authApi.login(credentials);
        onAuthenticated(credentials);
        return;
      }

      await authApi.register(credentials);
      setMode("login");
      setPassword("");
      setFeedback({
        type: "success",
        message: "Account created. Sign in with your new credentials.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <BrandMark />

        <div className="auth-story-copy">
          <p className="eyebrow">Your application command center</p>
          <h1>
            Keep every door
            <br />
            <em>within reach.</em>
          </h1>
          <p>
            Track the roles, programs, and scholarships that could shape what
            comes next—without another chaotic spreadsheet.
          </p>
        </div>

        <div className="mini-pipeline" aria-hidden="true">
          <div className="mini-pipeline-head">
            <span>Today’s focus</span>
            <span>03 opportunities</span>
          </div>
          <div className="mini-opportunity active">
            <span className="mini-index">01</span>
            <span>
              <strong>Research assistant</strong>
              <small>Application due Friday</small>
            </span>
            <span className="mini-dot" />
          </div>
          <div className="mini-opportunity">
            <span className="mini-index">02</span>
            <span>
              <strong>Product internship</strong>
              <small>Prepare cover letter</small>
            </span>
            <span className="mini-dot" />
          </div>
          <div className="mini-opportunity">
            <span className="mini-index">03</span>
            <span>
              <strong>Merit scholarship</strong>
              <small>Interview next week</small>
            </span>
            <span className="mini-dot" />
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand">
            <BrandMark />
          </div>

          <p className="section-label">
            {isLogin ? "Welcome back" : "Create your workspace"}
          </p>
          <h2>{isLogin ? "Sign in to continue" : "Start tracking smarter"}</h2>
          <p className="auth-intro">
            {isLogin
              ? "Your opportunities are private and ready when you are."
              : "One account keeps your applications and deadlines together."}
          </p>

          {feedback ? (
            <div
              className={`feedback ${feedback.type}`}
              role={feedback.type === "error" ? "alert" : "status"}
            >
              {feedback.message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>Username</span>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. alexchen"
                required
                autoFocus
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? isLogin
                    ? "Signing in…"
                    : "Creating account…"
                  : isLogin
                    ? "Sign in"
                    : "Create account"}
              </span>
              {!isSubmitting ? <Icon name="arrow" /> : null}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "New to OpportunityOS?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => changeMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${className}`}>{status}</span>;
}

function getDeadlineMeta(deadline) {
  if (!deadline) {
    return { label: "No deadline", tone: "" };
  }

  const date = new Date(`${deadline}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDifference = Math.round((date - today) / 86_400_000);
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
    return {
      label: `${formatted} · ${dayDifference}d left`,
      tone: "soon",
    };
  }

  return { label: formatted, tone: "" };
}

function StatusRail({ opportunities }) {
  const counts = useMemo(() => {
    const nextCounts = Object.fromEntries(
      STATUSES.map((status) => [status, 0]),
    );

    opportunities.forEach((opportunity) => {
      if (nextCounts[opportunity.status] !== undefined) {
        nextCounts[opportunity.status] += 1;
      }
    });

    return nextCounts;
  }, [opportunities]);

  return (
    <div className="status-rail" aria-label="Opportunity status overview">
      {STATUSES.map((status) => (
        <div className="rail-stop" key={status}>
          <span className={`rail-dot rail-${status.toLowerCase()}`} />
          <span className="rail-label">{status}</span>
          <strong>{counts[status]}</strong>
        </div>
      ))}
    </div>
  );
}

function OpportunityRow({ opportunity, onEdit, onDelete, isDeleting }) {
  const deadline = getDeadlineMeta(opportunity.deadline);

  return (
    <tr>
      <td>
        <div className="opportunity-name">
          <span className="company-avatar" aria-hidden="true">
            {opportunity.company.charAt(0).toUpperCase()}
          </span>
          <span>
            <strong>{opportunity.company}</strong>
            <small>{opportunity.position}</small>
          </span>
        </div>
      </td>
      <td>
        <StatusBadge status={opportunity.status} />
      </td>
      <td>
        <span className={`deadline ${deadline.tone}`}>
          <Icon name="calendar" size={16} />
          {deadline.label}
        </span>
      </td>
      <td>
        {opportunity.link ? (
          <a
            className="external-link"
            href={opportunity.link}
            target="_blank"
            rel="noreferrer"
          >
            Open <Icon name="external" size={15} />
          </a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td>
        <div className="row-actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => onEdit(opportunity)}
            aria-label={`Edit ${opportunity.company} ${opportunity.position}`}
            title="Edit opportunity"
          >
            <Icon name="edit" />
          </button>
          <button
            className="icon-button danger"
            type="button"
            onClick={() => onDelete(opportunity)}
            disabled={isDeleting}
            aria-label={`Delete ${opportunity.company} ${opportunity.position}`}
            title="Delete opportunity"
          >
            <Icon name="trash" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function OpportunityCard({ opportunity, onEdit, onDelete, isDeleting }) {
  const deadline = getDeadlineMeta(opportunity.deadline);

  return (
    <article className="opportunity-card">
      <div className="card-topline">
        <span className="company-avatar" aria-hidden="true">
          {opportunity.company.charAt(0).toUpperCase()}
        </span>
        <StatusBadge status={opportunity.status} />
      </div>
      <h3>{opportunity.position}</h3>
      <p className="card-company">{opportunity.company}</p>
      <div className={`deadline ${deadline.tone}`}>
        <Icon name="calendar" size={16} />
        {deadline.label}
      </div>
      <div className="card-actions">
        {opportunity.link ? (
          <a
            className="external-link"
            href={opportunity.link}
            target="_blank"
            rel="noreferrer"
          >
            Open link <Icon name="external" size={15} />
          </a>
        ) : (
          <span />
        )}
        <div className="row-actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => onEdit(opportunity)}
            aria-label={`Edit ${opportunity.company} ${opportunity.position}`}
          >
            <Icon name="edit" />
          </button>
          <button
            className="icon-button danger"
            type="button"
            onClick={() => onDelete(opportunity)}
            disabled={isDeleting}
            aria-label={`Delete ${opportunity.company} ${opportunity.position}`}
          >
            <Icon name="trash" />
          </button>
        </div>
      </div>
    </article>
  );
}

function OpportunityForm({ opportunity, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    opportunity
      ? {
          company: opportunity.company || "",
          position: opportunity.position || "",
          status: opportunity.status || "Interested",
          deadline: opportunity.deadline || "",
          link: opportunity.link || "",
        }
      : EMPTY_FORM,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(opportunity);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onSave({
        company: form.company.trim(),
        position: form.position.trim(),
        status: form.status,
        deadline: form.deadline,
        link: form.link.trim(),
      });
    } catch (saveError) {
      setError(
        saveError instanceof ApiError
          ? saveError.message
          : "Could not save this opportunity. Try again.",
      );
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="section-label">
              {isEditing ? "Update record" : "New record"}
            </p>
            <h2 id="opportunity-form-title">
              {isEditing ? "Edit opportunity" : "Add an opportunity"}
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            <Icon name="close" />
          </button>
        </div>

        {error ? (
          <div className="feedback error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="opportunity-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              <span>Company or organization</span>
              <input
                name="company"
                type="text"
                value={form.company}
                onChange={updateField}
                placeholder="e.g. Google"
                required
                autoFocus
              />
            </label>

            <label>
              <span>Position or program</span>
              <input
                name="position"
                type="text"
                value={form.position}
                onChange={updateField}
                placeholder="e.g. SWE Intern"
                required
              />
            </label>

            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={updateField}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Deadline</span>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={updateField}
                required
              />
            </label>

            <label className="full-field">
              <span>Opportunity link</span>
              <input
                name="link"
                type="url"
                value={form.link}
                onChange={updateField}
                placeholder="https://company.com/careers/..."
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="button button-primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Add opportunity"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ credentials, onLogout }) {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpportunity, setFormOpportunity] = useState(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadOpportunities = useCallback(async () => {
    setError("");

    try {
      const result = await opportunityApi.list(credentials);
      setOpportunities(Array.isArray(result) ? result : []);
    } catch (loadError) {
      if (loadError instanceof ApiError && loadError.status === 401) {
        onLogout("Your session could not be verified. Sign in again.");
        return;
      }

      setError(
        loadError instanceof ApiError
          ? loadError.message
          : "Could not load your opportunities.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [credentials, onLogout]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let active = 0;
    let dueSoon = 0;

    opportunities.forEach((opportunity) => {
      if (!["Rejected", "Withdrawn"].includes(opportunity.status)) {
        active += 1;
      }

      if (opportunity.deadline) {
        const deadline = new Date(`${opportunity.deadline}T00:00:00`);
        const days = Math.round((deadline - today) / 86_400_000);

        if (days >= 0 && days <= 14) {
          dueSoon += 1;
        }
      }
    });

    return {
      total: opportunities.length,
      active,
      dueSoon,
    };
  }, [opportunities]);

  function openCreateForm() {
    setFormOpportunity(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(opportunity) {
    setFormOpportunity(opportunity);
    setIsFormOpen(true);
  }

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setFormOpportunity(undefined);
  }, []);

  async function handleSave(payload) {
    if (formOpportunity) {
      const updated = await opportunityApi.update(
        formOpportunity.id,
        payload,
        credentials,
      );
      setOpportunities((current) =>
        current.map((opportunity) =>
          opportunity.id === formOpportunity.id ? updated : opportunity,
        ),
      );
    } else {
      const created = await opportunityApi.create(payload, credentials);
      setOpportunities((current) => [...current, created]);
    }

    closeForm();
  }

  async function handleDelete(opportunity) {
    const shouldDelete = window.confirm(
      `Delete ${opportunity.position} at ${opportunity.company}? This cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(opportunity.id);
    setError("");

    try {
      await opportunityApi.remove(opportunity.id, credentials);
      setOpportunities((current) =>
        current.filter((item) => item.id !== opportunity.id),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof ApiError
          ? deleteError.message
          : "Could not delete this opportunity.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <BrandMark />
        <div className="header-actions">
          <div className="user-chip">
            <span>{credentials.username.charAt(0).toUpperCase()}</span>
            <div>
              <small>Signed in as</small>
              <strong>{credentials.username}</strong>
            </div>
          </div>
          <button
            className="icon-button logout-button"
            type="button"
            onClick={() => onLogout()}
            aria-label="Log out"
            title="Log out"
          >
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <main className="dashboard">
        <section className="dashboard-heading">
          <div>
            <p className="eyebrow">Opportunity board</p>
            <h1>Make the next move clear.</h1>
            <p className="dashboard-subtitle">
              Keep every application, deadline, and decision in one view.
            </p>
          </div>
          <button
            className="button button-primary add-button"
            type="button"
            onClick={openCreateForm}
          >
            <Icon name="plus" />
            Add opportunity
          </button>
        </section>

        <section className="metric-grid" aria-label="Opportunity summary">
          <article className="metric-card primary-metric">
            <span>Total tracked</span>
            <strong>{metrics.total.toString().padStart(2, "0")}</strong>
            <small>Your complete opportunity list</small>
          </article>
          <article className="metric-card">
            <span>Still active</span>
            <strong>{metrics.active.toString().padStart(2, "0")}</strong>
            <small>Open paths worth your attention</small>
          </article>
          <article className="metric-card">
            <span>Due in 14 days</span>
            <strong>{metrics.dueSoon.toString().padStart(2, "0")}</strong>
            <small>Deadlines coming into focus</small>
          </article>
        </section>

        <StatusRail opportunities={opportunities} />

        {error ? (
          <div className="feedback error dashboard-feedback" role="alert">
            <span>{error}</span>
            <button type="button" onClick={loadOpportunities}>
              Try again
            </button>
          </div>
        ) : null}

        <section className="opportunities-section">
          <div className="section-heading">
            <div>
              <p className="section-label">Your records</p>
              <h2>All opportunities</h2>
            </div>
            <span className="record-count">
              {opportunities.length}{" "}
              {opportunities.length === 1 ? "record" : "records"}
            </span>
          </div>

          {isLoading ? (
            <div className="loading-state" aria-live="polite">
              <span className="spinner" />
              <p>Loading your opportunities…</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="empty-state">
              <span className="empty-mark" aria-hidden="true">
                O<span>+</span>
              </span>
              <h3>Your board is ready.</h3>
              <p>
                Add the first role, scholarship, or research program you want to
                pursue.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={openCreateForm}
              >
                <Icon name="plus" />
                Add your first opportunity
              </button>
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Opportunity</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th>Link</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map((opportunity) => (
                      <OpportunityRow
                        key={opportunity.id}
                        opportunity={opportunity}
                        onEdit={openEditForm}
                        onDelete={handleDelete}
                        isDeleting={deletingId === opportunity.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-card-list">
                {opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                    isDeleting={deletingId === opportunity.id}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>OpportunityOS</span>
        <span>One clear place for what comes next.</span>
      </footer>

      {isFormOpen ? (
        <OpportunityForm
          opportunity={formOpportunity}
          onClose={closeForm}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}

export default function App() {
  const [credentials, setCredentials] = useState(readStoredCredentials);
  const [sessionMessage, setSessionMessage] = useState("");

  const handleAuthenticated = useCallback((nextCredentials) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextCredentials));
    setCredentials(nextCredentials);
    setSessionMessage("");
  }, []);

  const handleLogout = useCallback((message = "") => {
    sessionStorage.removeItem(SESSION_KEY);
    setCredentials(null);
    setSessionMessage(message);
  }, []);

  if (!credentials) {
    return (
      <>
        {sessionMessage ? (
          <div className="session-notice" role="alert">
            {sessionMessage}
          </div>
        ) : null}
        <AuthScreen onAuthenticated={handleAuthenticated} />
      </>
    );
  }

  return <Dashboard credentials={credentials} onLogout={handleLogout} />;
}
