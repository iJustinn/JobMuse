// === ui.jsx ===
// Shared UI primitives for JobMuse.
// Icons: line-style, 16px, drawn fresh — kept geometric & simple.

const Icon = ({ name, size = 16, stroke = 1.5, style }) => {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "home":      return <svg {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>;
    case "plus":      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "history":   return <svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case "memory":    return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>;
    case "user":      return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "settings":  return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "search":    return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case "sparkle":   return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case "check":     return <svg {...p}><path d="M4 12l5 5L20 6"/></svg>;
    case "chevron":   return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case "chev-down": return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case "edit":      return <svg {...p}><path d="M4 20h4l10-10-4-4L4 16z"/><path d="M14 6l4 4"/></svg>;
    case "copy":      return <svg {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>;
    case "download":  return <svg {...p}><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></svg>;
    case "external":  return <svg {...p}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>;
    case "filter":    return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case "trash":     return <svg {...p}><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>;
    case "dot":       return <svg {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>;
    case "arrow-r":   return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-l":   return <svg {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case "logo":      return <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4.5"  y="9"  width="2.6" height="11" rx="1.3"/><rect x="10.7" y="3"  width="2.6" height="17" rx="1.3"/><rect x="16.9" y="6.5" width="2.6" height="13.5" rx="1.3"/></svg>;
    case "upload":    return <svg {...p}><path d="M12 20V8M6 12l6-6 6 6"/><path d="M4 4h16"/></svg>;
    case "x":         return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "tag":       return <svg {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;
    case "doc":       return <svg {...p}><path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg>;
    case "wand":      return <svg {...p}><path d="M3 21l12-12"/><path d="M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19 12l.6 1.2 1.4.6-1.4.6-.6 1.2-.6-1.2-1.4-.6 1.4-.6z"/></svg>;
    default: return null;
  }
};

// Tiny Button
const Button = ({ children, kind = "ghost", size = "md", icon, iconRight, onClick, disabled, style, type = "button", title }) => {
  const sizes = {
    sm: { h: 26, px: 8,  fs: 12.5 },
    md: { h: 30, px: 10, fs: 13 },
    lg: { h: 36, px: 14, fs: 13.5 },
  }[size];
  const kinds = {
    primary: { bg: "var(--jr-ink)", fg: "var(--jr-bg)", bd: "var(--jr-ink)" },
    ghost:   { bg: "transparent",   fg: "var(--jr-fg)", bd: "transparent" },
    bordered:{ bg: "var(--jr-card)",fg: "var(--jr-fg)", bd: "var(--jr-border-1)" },
    subtle:  { bg: "var(--jr-bg-2)",fg: "var(--jr-fg)", bd: "transparent" },
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={`jr-btn jr-btn-${kind}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: sizes.h, padding: `0 ${sizes.px}px`,
        background: kinds.bg, color: kinds.fg,
        border: `1px solid ${kinds.bd}`,
        borderRadius: 6, fontSize: sizes.fs, fontWeight: 500,
        letterSpacing: "-.005em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background .12s ease, border-color .12s ease, transform .08s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
};

// Hover styles for button kinds — global stylesheet because inline can't do :hover
const __JR_BTN_CSS = `
.jr-btn-ghost:hover    { background: var(--jr-bg-2) !important; }
.jr-btn-bordered:hover { background: var(--jr-bg-2) !important; }
.jr-btn-subtle:hover   { background: var(--jr-bg-3) !important; }
.jr-btn-primary:hover  { opacity: .9; }
.jr-btn:active         { transform: translateY(.5px); }
.jr-row:hover { background: var(--jr-bg-2); }
.jr-link:hover { color: var(--jr-fg) !important; }
.jr-tab.active { color: var(--jr-fg); border-color: var(--jr-fg); }
mark.jr-mark { background: var(--jr-mark); color: var(--jr-mark-fg); padding: 1px 4px; border-radius: 3px; font-weight: 500; }
[data-theme="dark"] mark.jr-mark { background: #3a3a35; }
.jr-input:focus { outline: none; border-color: var(--jr-fg-2); background: var(--jr-card); }
.jr-input::placeholder { color: var(--jr-fg-3); }
.jr-pulse::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: 0 0 0 0 rgba(28,28,26,.18);
  animation: jrPulse 1.4s infinite;
}
@keyframes jrPulse { 0% { box-shadow: 0 0 0 0 rgba(28,28,26,.18); } 100% { box-shadow: 0 0 0 12px rgba(28,28,26,0); } }
.jr-spin { animation: jrSpin 1s linear infinite; }
@keyframes jrSpin { to { transform: rotate(360deg); } }
.jr-fade-in { animation: jrFadeIn .35s ease both; }
@keyframes jrFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.jr-stagger > * { animation: jrFadeIn .35s ease both; }
.jr-stagger > *:nth-child(1) { animation-delay: .04s; }
.jr-stagger > *:nth-child(2) { animation-delay: .10s; }
.jr-stagger > *:nth-child(3) { animation-delay: .16s; }
.jr-stagger > *:nth-child(4) { animation-delay: .22s; }
.jr-stagger > *:nth-child(5) { animation-delay: .28s; }
.jr-stagger > *:nth-child(6) { animation-delay: .34s; }
`;

// Status dot for application status
const StatusDot = ({ status }) => {
  const map = {
    Draft:     { bg: "var(--jr-fg-3)" },
    Applied:   { bg: "var(--jr-fg-1)" },
    Interview: { bg: "var(--jr-ink)" },
    Offer:     { bg: "var(--jr-ink)", ring: true },
    Rejected:  { bg: "var(--jr-fg-3)", hollow: true },
    Ghosted:   { bg: "var(--jr-fg-3)", hollow: true },
  };
  const s = map[status] || map.Draft;
  return (
    <span style={{
      display: "inline-block",
      width: 7, height: 7, borderRadius: 999,
      background: s.hollow ? "transparent" : s.bg,
      border: `1.25px solid ${s.bg}`,
      boxShadow: s.ring ? `0 0 0 2.5px var(--jr-bg)` : "none",
      outline: s.ring ? `1.25px solid var(--jr-ink)` : "none",
    }}/>
  );
};

const Pill = ({ children, mono, style }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", height: 20,
    padding: "0 7px", borderRadius: 4,
    background: "var(--jr-bg-2)",
    color: "var(--jr-fg-1)",
    fontSize: 11.5, fontWeight: 500,
    fontFamily: mono ? "var(--jr-mono)" : undefined,
    letterSpacing: mono ? 0 : "-.005em",
    ...style,
  }}>{children}</span>
);

const Kbd = ({ children }) => (
  <kbd style={{
    fontFamily: "var(--jr-mono)", fontSize: 11,
    padding: "1px 5px", borderRadius: 4,
    border: "1px solid var(--jr-border-1)",
    background: "var(--jr-card)",
    color: "var(--jr-fg-1)",
    minWidth: 16, display: "inline-flex", justifyContent: "center",
  }}>{children}</kbd>
);

const SectionHeader = ({ title, subtitle, right, sticky }) => (
  <div style={{
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    gap: 16, padding: "0 0 14px",
    borderBottom: "1px solid var(--jr-border)",
    marginBottom: 20,
    position: sticky ? "sticky" : "static",
    top: 0, background: "var(--jr-bg)", zIndex: 1,
  }}>
    <div>
      <h1 style={{
        margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-.018em",
        color: "var(--jr-ink)",
      }}>{title}</h1>
      {subtitle && <p style={{
        margin: "4px 0 0", fontSize: 13.5, color: "var(--jr-fg-1)",
        letterSpacing: "-.005em",
      }}>{subtitle}</p>}
    </div>
    {right && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{right}</div>}
  </div>
);

// Subtle field label
const FieldLabel = ({ children }) => (
  <label style={{
    display: "block", fontSize: 11.5, fontWeight: 500,
    color: "var(--jr-fg-1)", letterSpacing: ".02em",
    textTransform: "uppercase", marginBottom: 6,
  }}>{children}</label>
);

const Input = React.forwardRef(({ style, ...rest }, ref) => (
  <input ref={ref} className="jr-input" {...rest}
    style={{
      width: "100%", height: 32, padding: "0 10px",
      background: "var(--jr-bg-1)",
      border: "1px solid var(--jr-border)",
      borderRadius: 6,
      color: "var(--jr-fg)",
      fontSize: 13.5, letterSpacing: "-.005em",
      transition: "border-color .12s, background .12s",
      ...style,
    }}/>
));

const Textarea = ({ style, ...rest }) => (
  <textarea className="jr-input" {...rest}
    style={{
      width: "100%", padding: "10px 12px",
      background: "var(--jr-bg-1)",
      border: "1px solid var(--jr-border)",
      borderRadius: 6,
      color: "var(--jr-fg)",
      fontSize: 13.5, lineHeight: 1.55, letterSpacing: "-.005em",
      transition: "border-color .12s, background .12s",
      ...style,
    }}/>
);

// Empty state shape
const Empty = ({ icon = "doc", title, body, action }) => (
  <div style={{
    border: "1px dashed var(--jr-border-1)", borderRadius: 10,
    padding: "32px 24px", textAlign: "center", color: "var(--jr-fg-1)",
  }}>
    <div style={{ display: "inline-flex", padding: 8, borderRadius: 8,
      background: "var(--jr-bg-2)", color: "var(--jr-fg-1)" }}>
      <Icon name={icon} size={18}/>
    </div>
    <div style={{ marginTop: 10, color: "var(--jr-fg)", fontWeight: 500, fontSize: 14 }}>{title}</div>
    {body && <div style={{ marginTop: 4, fontSize: 13 }}>{body}</div>}
    {action && <div style={{ marginTop: 14 }}>{action}</div>}
  </div>
);

// Highlight a text body using a list of phrases.
function highlightText(text, phrases) {
  if (!phrases || !phrases.length) return text;
  // Escape regex
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${phrases.map(p => esc(p.phrase || p)).join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? <mark key={i} className="jr-mark">{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

Object.assign(window, {
  Icon, Button, StatusDot, Pill, Kbd, SectionHeader, FieldLabel, Input, Textarea, Empty, highlightText,
  __JR_BTN_CSS,
});


// === screens.jsx ===
// Screens for JobMuse.
// Each screen is a React component that consumes window.JR_DATA + props from App.

const D = window.JR_DATA;

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ go, generated }) {
  const recent = D.applications.slice(0, 5);
  const stats = [
    { label: "Applications", value: D.applications.length, hint: "all-time" },
    { label: "This week",    value: 3, hint: "+2 vs last" },
    { label: "Reply rate",   value: "34%", hint: "industry avg 12%" },
    { label: "Memory facts", value: Object.values(D.memory).flat().length, hint: "across 6 categories" },
  ];

  return (
    <div className="jr-fade-in" style={{ maxWidth: 980, margin: "0 auto" }}>
      <SectionHeader
        title={`Hey, ${D.user.name.split(" ")[0]}.`}
        subtitle="Three drafts open. Two interviews this week. One offer waiting on you."
        right={
          <Button kind="primary" icon="plus" size="lg" onClick={() => go("new")}>
            New application
          </Button>
        }
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }} className="jr-stagger">
        {stats.map((s) => (
          <div key={s.label} style={{
            border: "1px solid var(--jr-border)", borderRadius: 10,
            padding: "14px 16px", background: "var(--jr-card)",
          }}>
            <div style={{ fontSize: 11.5, color: "var(--jr-fg-1)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 500 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", marginTop: 6, color: "var(--jr-ink)" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--jr-fg-2)", marginTop: 2 }}>{s.hint}</div>
          </div>
        ))}
      </div>

      {/* Recent applications + Memory snapshot */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--jr-ink)" }}>Recent applications</h2>
            <button className="jr-link" onClick={() => go("history")}
              style={{ background: "none", border: 0, color: "var(--jr-fg-1)", fontSize: 12.5, cursor: "pointer", padding: 0 }}>
              View all →
            </button>
          </div>
          <div style={{ border: "1px solid var(--jr-border)", borderRadius: 10, overflow: "hidden", background: "var(--jr-card)" }}>
            {recent.map((a, i) => (
              <div key={a.id} className="jr-row" style={{
                display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 14,
                alignItems: "center",
                padding: "10px 14px",
                borderTop: i ? "1px solid var(--jr-border)" : "none",
                cursor: "pointer",
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, color: "var(--jr-ink)", fontSize: 13.5,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.role}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--jr-fg-1)", marginTop: 2 }}>{a.company}</div>
                </div>
                <Pill mono>{a.match}%</Pill>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 80, fontSize: 12.5, color: "var(--jr-fg-1)" }}>
                  <StatusDot status={a.status}/>
                  {a.status}
                </div>
                <div style={{ fontSize: 12, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)" }}>
                  {a.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--jr-ink)" }}>Memory snapshot</h2>
            <button className="jr-link" onClick={() => go("memory")}
              style={{ background: "none", border: 0, color: "var(--jr-fg-1)", fontSize: 12.5, cursor: "pointer", padding: 0 }}>
              Open →
            </button>
          </div>
          <div style={{ border: "1px solid var(--jr-border)", borderRadius: 10, padding: 14, background: "var(--jr-card)" }}>
            {Object.entries(D.memory).slice(0, 4).map(([cat, facts]) => (
              <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid var(--jr-border)" }}>
                <span style={{ fontSize: 13, color: "var(--jr-fg)" }}>{cat}</span>
                <span style={{ fontSize: 12, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)" }}>{facts.length}</span>
              </div>
            ))}
            <Button kind="ghost" icon="plus" size="sm" style={{ marginTop: 10 }} onClick={() => go("memory")}>
              Add a fact
            </Button>
          </div>

          {/* Tip card */}
          <div style={{ marginTop: 16, border: "1px solid var(--jr-border)", borderRadius: 10,
            padding: "12px 14px", background: "var(--jr-bg-1)", display: "flex", gap: 10 }}>
            <Icon name="sparkle" size={14} style={{ color: "var(--jr-fg-1)", flexShrink: 0, marginTop: 2 }}/>
            <div style={{ fontSize: 12.5, color: "var(--jr-fg-1)", lineHeight: 1.5 }}>
              The more facts you add to <b style={{ color: "var(--jr-fg)" }}>Memory</b>, the more specific your tailored CVs get.
              Pasting Slack messages, old cover letters, and notes works.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── New Application ─────────────────────────────────────────────────────────
function NewApplication({ generated, setGenerated, layout }) {
  const [jd, setJd] = React.useState(D.sampleJD);
  const [phase, setPhase] = React.useState(generated ? "done" : "input"); // input | generating | done
  const [progress, setProgress] = React.useState(0);
  const [chatOpen, setChatOpen] = React.useState(generated);
  const [patches, setPatches] = React.useState([]);

  function applyPatch(label) {
    setPatches((p) => [...p, { id: Date.now() + Math.random(), label, ts: Date.now() }]);
  }

  const phases = [
    "Reading job description",
    "Extracting requirements",
    "Querying memory",
    "Drafting summary",
    "Tailoring experience bullets",
    "Re-ranking skills",
    "Polishing",
  ];
  const [step, setStep] = React.useState(0);

  function generate() {
    setPhase("generating");
    setStep(0); setProgress(0);
    let s = 0;
    const tick = setInterval(() => {
      s += 1;
      setStep(s);
      setProgress(Math.min(100, Math.round((s / phases.length) * 100)));
      if (s >= phases.length) {
        clearInterval(tick);
        setTimeout(() => { setPhase("done"); setGenerated(true); }, 350);
      }
    }, 380);
  }

  function reset() {
    setGenerated(false);
    setPhase("input");
    setProgress(0); setStep(0);
  }

  if (phase === "input") {
    return (
      <div className="jr-fade-in" style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionHeader
          title="New application"
          subtitle="Paste a job description. We'll write the CV against your memory."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Input placeholder="Company"          defaultValue="Linear" />
          <Input placeholder="Role title"       defaultValue="Associate Product Designer" />
        </div>
        <Textarea
          rows={20}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here…"
          style={{ minHeight: 360, fontSize: 13.5 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "var(--jr-fg-2)", display: "flex", gap: 14 }}>
            <span>{jd.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>·</span>
            <span>{D.jdSignals.length} signals detected on paste</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button kind="bordered" onClick={() => setJd("")}>Clear</Button>
            <Button kind="primary" icon="wand" onClick={generate} disabled={!jd.trim()}>
              Generate CV
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "generating") {
    return (
      <div className="jr-fade-in" style={{ maxWidth: 480, margin: "120px auto 0", textAlign: "left" }}>
        <div style={{ position: "relative", display: "inline-flex", padding: 12, borderRadius: 12,
          background: "var(--jr-bg-2)", color: "var(--jr-fg)", marginBottom: 18 }}>
          <span className="jr-pulse" style={{ position: "absolute", inset: 0, borderRadius: 12, pointerEvents: "none" }}/>
          <Icon name="wand" size={20}/>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-.018em", color: "var(--jr-ink)" }}>
          Tailoring your CV
        </h1>
        <p style={{ margin: "4px 0 28px", color: "var(--jr-fg-1)", fontSize: 13.5 }}>
          Pulling from {Object.values(D.memory).flat().length} facts in memory.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--jr-mono)", fontSize: 12.5 }}>
          {phases.map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10,
              color: i < step ? "var(--jr-fg)" : i === step ? "var(--jr-fg)" : "var(--jr-fg-3)",
              transition: "color .2s",
            }}>
              <span style={{ width: 14, display: "inline-flex", justifyContent: "center" }}>
                {i < step ? <Icon name="check" size={14}/> :
                 i === step ? <span style={{
                   width: 7, height: 7, borderRadius: 999, background: "var(--jr-ink)",
                   boxShadow: "0 0 0 0 var(--jr-ink)", animation: "jrPulse 1.2s infinite",
                 }}/> :
                 <span style={{ width: 7, height: 7, borderRadius: 999, border: "1px solid var(--jr-fg-3)" }}/>}
              </span>
              {p}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, height: 2, background: "var(--jr-border)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "var(--jr-ink)", width: `${progress}%`, transition: "width .3s" }}/>
        </div>
      </div>
    );
  }

  // phase === "done" — side-by-side
  return (
    <div className="jr-fade-in" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Result header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 0 14px", borderBottom: "1px solid var(--jr-border)", marginBottom: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-.014em", color: "var(--jr-ink)" }}>
              Linear  ·  Associate Product Designer
            </h1>
            <Pill style={{ background: "var(--jr-ink)", color: "var(--jr-bg)" }}>87% match</Pill>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--jr-fg-1)", marginTop: 4, display: "flex", gap: 12 }}>
            <span>{D.cvChanges.length} sections tailored</span>
            <span>·</span>
            <span>Pulled {Object.values(D.memory).flat().length - 6} facts from memory</span>
            <span>·</span>
            <span>Saved as draft</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button kind={chatOpen ? "subtle" : "bordered"} icon="sparkle" onClick={() => setChatOpen(v => !v)}>
            {chatOpen ? "Close chat" : "Revise with AI"}
          </Button>
          <Button kind="ghost" icon="copy">Copy</Button>
          <Button kind="bordered" icon="download">PDF</Button>
          <Button kind="primary" icon="external">Apply on Linear</Button>
          <div style={{ width: 1, background: "var(--jr-border)", height: 24, alignSelf: "center", margin: "0 4px" }}/>
          <Button kind="ghost" onClick={reset}>Start over</Button>
        </div>
      </div>

      <div style={{
        flex: 1, minHeight: 0,
        display: "grid",
        gridTemplateColumns: chatOpen ? "1fr 360px" : "1fr",
        gap: 16,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: layout === "stacked" ? "1fr" : layout === "cv-first" ? "1fr 1.2fr" : "1fr 1fr",
          gridTemplateRows: layout === "stacked" ? "1fr 1fr" : "1fr",
          gap: 16, minHeight: 0,
        }}>
          <JDPanel jd={jd} patches={patches}/>
          <CVPanel patches={patches}/>
        </div>
        {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} onPatch={applyPatch}/>}
      </div>
    </div>
  );
}

function ChatPanel({ onClose, onPatch }) {
  const [messages, setMessages] = React.useState([
    {
      role: "ai",
      text: "Anything to change? I can rewrite sections, tighten bullets, add metrics, or restructure for a specific tone.",
    },
  ]);
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const listRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, pending]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const suggestions = [
    { label: "Tighten the summary",      patch: "Summary",     reply: "Cut from 28 to 17 words. New lead: \u201CDesigner who codes. Two products shipped, real users.\u201D Want to keep it?" },
    { label: "Add metrics to Plate",     patch: "Plate bullets",reply: "Surfaced D7 retention 22% \u2192 41%, 1.2k WAU, 14 user interviews. Promoted them above the design-system bullet." },
    { label: "Cut to one page",          patch: "Length",       reply: "Dropped one Cloudflare bullet, condensed coursework, trimmed projects. Currently 0.94 pages." },
    { label: "Match Linear's voice",     patch: "Tone",         reply: "Shorter sentences, fewer adjectives, no buzzwords. Verbs lead. Showing diff in CV pane." },
    { label: "Lead with the Cloudflare disagreement", patch: "Cloudflare", reply: "Moved the disagree-and-commit bullet to the top of Cloudflare. Kept the benchmark detail." },
  ];

  function send(text, patchLabel) {
    const userMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setPending(true);

    // Find a matching suggestion or generate generic reply
    const match = suggestions.find(s => s.label.toLowerCase() === text.toLowerCase());
    const reply = match ? match.reply
      : /metric|number|quant/i.test(text) ? "Pulled three quantitative facts from memory and dropped them into the most relevant bullets. Numbers always win."
      : /short|tight|concise|trim|cut/i.test(text) ? "Tightened. Cut filler clauses; verbs lead each line. ~14% shorter overall."
      : /tone|voice|match/i.test(text) ? "Adjusted to a more direct register. Less hedging, more action."
      : /add|include|mention/i.test(text) ? "Added it. Placed where it earns the most attention given the JD signals."
      : "Done. Drafted a revision \u2014 review the highlighted sections in the CV pane and tell me to keep or revert.";
    const label = match ? match.patch : patchLabel || "Revision";

    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: reply, patch: label }]);
      onPatch && onPatch(label);
      setPending(false);
    }, 700 + Math.random() * 600);
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (draft.trim() && !pending) send(draft.trim());
    }
  }

  return (
    <aside className="jr-fade-in" style={{
      display: "flex", flexDirection: "column", minHeight: 0,
      border: "1px solid var(--jr-border)", borderRadius: 10,
      background: "var(--jr-card)", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 12px 10px 14px", borderBottom: "1px solid var(--jr-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, background: "var(--jr-ink)",
            color: "var(--jr-bg)", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="sparkle" size={12}/></span>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--jr-ink)" }}>Revise with AI</div>
            <div style={{ fontSize: 11, color: "var(--jr-fg-2)" }}>Edits apply to this CV only</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: 0, padding: 4, borderRadius: 4, cursor: "pointer",
          color: "var(--jr-fg-2)",
        }} title="Close"><Icon name="x" size={14}/></button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="jr-scroll" style={{
        flex: 1, minHeight: 0, overflowY: "auto",
        padding: "14px 14px 4px", display: "flex", flexDirection: "column", gap: 10,
      }}>
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} patch={m.patch}/>
        ))}
        {pending && <ChatBubble role="ai" typing/>}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && !pending && (
        <div style={{ padding: "6px 12px 10px", display: "flex", flexWrap: "wrap", gap: 6,
          borderTop: "1px solid var(--jr-border)" }}>
          {suggestions.map((s) => (
            <button key={s.label} onClick={() => send(s.label, s.patch)}
              style={{
                background: "var(--jr-bg-1)", border: "1px solid var(--jr-border)",
                borderRadius: 999, padding: "4px 10px", fontSize: 12,
                color: "var(--jr-fg)", cursor: "pointer",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--jr-bg-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--jr-bg-1)"}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{
        padding: 10, borderTop: "1px solid var(--jr-border)",
        background: "var(--jr-bg-1)",
      }}>
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 8,
          background: "var(--jr-card)", border: "1px solid var(--jr-border)",
          borderRadius: 8, padding: "8px 8px 8px 12px",
        }}>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            placeholder="Tell the AI what to change\u2026"
            rows={1}
            style={{
              flex: 1, border: 0, outline: "none", background: "transparent",
              color: "var(--jr-fg)", fontSize: 13, lineHeight: 1.5,
              fontFamily: "inherit", maxHeight: 120, minHeight: 18,
              padding: "2px 0",
            }}
          />
          <button
            onClick={() => draft.trim() && !pending && send(draft.trim())}
            disabled={!draft.trim() || pending}
            style={{
              width: 26, height: 26, borderRadius: 6,
              background: draft.trim() ? "var(--jr-ink)" : "var(--jr-bg-3)",
              color: draft.trim() ? "var(--jr-bg)" : "var(--jr-fg-2)",
              border: 0, cursor: draft.trim() && !pending ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
            title="Send (Enter)"
          ><Icon name="arrow-r" size={13}/></button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 6, fontSize: 11, color: "var(--jr-fg-2)" }}>
          <span><Kbd>↵</Kbd> send  ·  <Kbd>⇧↵</Kbd> new line</span>
          <span style={{ fontFamily: "var(--jr-mono)" }}>haiku-4.5</span>
        </div>
      </div>
    </aside>
  );
}

function ChatBubble({ role, text, patch, typing }) {
  const isUser = role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
    }}>
      <div style={{
        maxWidth: "86%",
        background: isUser ? "var(--jr-ink)" : "var(--jr-bg-1)",
        color: isUser ? "var(--jr-bg)" : "var(--jr-fg)",
        border: isUser ? "1px solid var(--jr-ink)" : "1px solid var(--jr-border)",
        borderRadius: 10,
        padding: typing ? "10px 12px" : "8px 11px",
        fontSize: 13, lineHeight: 1.5,
        letterSpacing: "-.005em",
      }}>
        {typing ? <TypingDots/> : text}
        {patch && !isUser && (
          <div style={{
            marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, color: "var(--jr-fg-1)",
            background: "var(--jr-bg-2)", padding: "2px 7px", borderRadius: 4,
          }}>
            <Icon name="check" size={11}/> Updated <b style={{ color: "var(--jr-fg)", fontWeight: 500 }}>{patch}</b>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, padding: "3px 0" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 999,
          background: "var(--jr-fg-2)",
          animation: `jrBlink 1.1s ${i*0.15}s infinite`,
        }}/>
      ))}
      <style>{`@keyframes jrBlink { 0%,80%,100% { opacity: .25 } 40% { opacity: 1 } }`}</style>
    </span>
  );
}

function JDPanel({ jd, patches }) {
  // Render JD with highlighted signals
  const lines = jd.split("\n");
  return (
    <div className="jr-scroll" style={{
      border: "1px solid var(--jr-border)", borderRadius: 10,
      background: "var(--jr-card)", display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderBottom: "1px solid var(--jr-border)",
        position: "sticky", top: 0, background: "var(--jr-card)", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="doc" size={14} style={{ color: "var(--jr-fg-1)" }}/>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>Job description</span>
          <Pill mono>{D.jdSignals.length} signals</Pill>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Button kind="ghost" size="sm" icon="external" title="Open original"/>
        </div>
      </div>
      <div className="jr-scroll" style={{ padding: "16px 18px", overflowY: "auto",
        fontSize: 13, lineHeight: 1.65, color: "var(--jr-fg)" }}>
        {lines.map((line, i) => {
          if (!line.trim()) return <div key={i} style={{ height: 8 }}/>;
          const isHeader = /^(What you'll do|What we're looking for|Nice to have)/i.test(line);
          if (isHeader) return (
            <h3 key={i} style={{
              margin: "16px 0 6px", fontSize: 13, fontWeight: 600,
              color: "var(--jr-ink)", letterSpacing: "-.005em",
            }}>{line}</h3>
          );
          return (
            <p key={i} style={{ margin: "0 0 4px" }}>
              {highlightText(line, D.jdSignals)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function CVPanel({ patches = [] }) {
  const cv = D.generatedCV;
  const lastPatch = patches[patches.length - 1];
  return (
    <div style={{
      border: "1px solid var(--jr-border)", borderRadius: 10,
      background: "var(--jr-card)", display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderBottom: "1px solid var(--jr-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="sparkle" size={14} style={{ color: "var(--jr-fg-1)" }}/>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>Tailored CV</span>
          <Pill mono>v1 · draft</Pill>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Button kind="ghost" size="sm" icon="edit">Edit</Button>
          <Button kind="ghost" size="sm" icon="copy"/>
        </div>
      </div>
      <div className="jr-scroll" style={{ padding: "26px 32px", overflowY: "auto",
        fontFamily: "Geist, sans-serif", color: "var(--jr-fg)" }}>
        {/* CV header */}
        <div style={{ borderBottom: "1px solid var(--jr-border)", paddingBottom: 14, marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-.02em", color: "var(--jr-ink)" }}>
            {cv.header.name}
          </h2>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--jr-fg-1)", fontFamily: "var(--jr-mono)" }}>
            {cv.header.contact}
          </div>
        </div>

        {/* Summary */}
        <CVSection label="Summary" tag="rewritten">
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}>
            {highlightText(cv.summary, [{ phrase: "designer's eye" }, { phrase: "Ship-focused" }, { phrase: "write before I code" }])}
          </p>
        </CVSection>

        {/* Experience */}
        <CVSection label="Experience" tag={`${cv.experience.length} roles`}>
          {cv.experience.map((e) => (
            <div key={e.company} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 600, color: "var(--jr-ink)", fontSize: 13.5 }}>{e.company}</span>
                  <span style={{ color: "var(--jr-fg-1)", fontSize: 13.5 }}>  ·  {e.role}</span>
                </div>
                <span style={{ fontFamily: "var(--jr-mono)", fontSize: 11.5, color: "var(--jr-fg-2)" }}>{e.dates}</span>
              </div>
              <ul style={{ margin: "6px 0 0", padding: "0 0 0 16px", fontSize: 13, lineHeight: 1.6 }}>
                {e.bullets.map((b, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>{highlightText(b, e.highlight.map(h => ({ phrase: h })))}</li>
                ))}
              </ul>
            </div>
          ))}
        </CVSection>

        {/* Projects */}
        <CVSection label="Projects">
          {cv.projects.map((p) => (
            <div key={p.name} style={{ display: "flex", gap: 10, fontSize: 13, marginBottom: 4 }}>
              <span style={{ fontWeight: 500, minWidth: 130, color: "var(--jr-ink)" }}>{p.name}</span>
              <span style={{ color: "var(--jr-fg-1)" }}>{highlightText(p.note, p.highlight.map(h => ({ phrase: h })))}</span>
            </div>
          ))}
        </CVSection>

        {/* Education */}
        <CVSection label="Education">
          <div style={{ fontSize: 13 }}>
            <div style={{ fontWeight: 500, color: "var(--jr-ink)" }}>{cv.education.school}</div>
            <div style={{ color: "var(--jr-fg-1)", marginTop: 2 }}>{cv.education.degree}</div>
            <div style={{ color: "var(--jr-fg-1)", fontSize: 12.5, marginTop: 2 }}>{cv.education.detail}</div>
          </div>
        </CVSection>

        {/* Skills */}
        <CVSection label="Skills" tag="reordered">
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--jr-fg-1)" }}>
            {highlightText(cv.skills, [{ phrase: "TypeScript" }, { phrase: "React" }, { phrase: "Figma" }, { phrase: "design systems" }, { phrase: "user research" }, { phrase: "technical writing" }])}
          </p>
        </CVSection>

        {/* Changelog */}
        <div style={{ marginTop: 28, padding: 14, background: "var(--jr-bg-1)",
          border: "1px solid var(--jr-border)", borderRadius: 8 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: ".06em", color: "var(--jr-fg-1)", marginBottom: 8 }}>
            What changed vs. your base CV
          </div>
          {D.cvChanges.map((c) => (
            <div key={c.section} style={{ display: "flex", gap: 12, fontSize: 12.5, padding: "5px 0" }}>
              <span style={{ minWidth: 110, color: "var(--jr-fg)", fontWeight: 500 }}>{c.section}</span>
              <span style={{ color: "var(--jr-fg-1)" }}>{c.note}</span>
            </div>
          ))}
          {patches.map((p) => (
            <div key={p.id} className="jr-fade-in" style={{ display: "flex", gap: 12, fontSize: 12.5, padding: "5px 0",
              borderTop: "1px dashed var(--jr-border-1)", marginTop: 4, paddingTop: 8 }}>
              <span style={{ minWidth: 110, color: "var(--jr-fg)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="sparkle" size={11} style={{ color: "var(--jr-fg-1)" }}/>{p.label}
              </span>
              <span style={{ color: "var(--jr-fg-1)" }}>Revised via chat · just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CVSection({ label, tag, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <h3 style={{
          margin: 0, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: ".08em", color: "var(--jr-fg-1)",
        }}>{label}</h3>
        {tag && <span style={{
          fontSize: 10.5, fontFamily: "var(--jr-mono)",
          color: "var(--jr-fg-2)",
          padding: "1px 6px", borderRadius: 3,
          background: "var(--jr-bg-2)",
        }}>{tag}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────
function History() {
  const [filter, setFilter] = React.useState("All");
  const filters = ["All", "Draft", "Applied", "Interview", "Offer", "Rejected", "Ghosted"];
  const apps = filter === "All" ? D.applications : D.applications.filter(a => a.status === filter);

  return (
    <div className="jr-fade-in">
      <SectionHeader
        title="Applications"
        subtitle={`${D.applications.length} total. Filter or search to drill in.`}
        right={
          <>
            <div style={{ position: "relative" }}>
              <Icon name="search" size={14} style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                color: "var(--jr-fg-2)", pointerEvents: "none",
              }}/>
              <Input placeholder="Search company or role…" style={{ width: 260, paddingLeft: 30 }}/>
            </div>
            <Button kind="primary" icon="plus">New</Button>
          </>
        }
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 18, borderBottom: "1px solid var(--jr-border)", marginBottom: 14 }}>
        {filters.map((f) => {
          const count = f === "All" ? D.applications.length : D.applications.filter(a => a.status === f).length;
          const active = filter === f;
          return (
            <button key={f} className={`jr-tab ${active ? "active" : ""}`}
              onClick={() => setFilter(f)}
              style={{
                background: "none", border: 0, padding: "8px 0",
                borderBottom: `1.5px solid ${active ? "var(--jr-ink)" : "transparent"}`,
                color: active ? "var(--jr-ink)" : "var(--jr-fg-1)",
                fontSize: 13, fontWeight: active ? 500 : 400,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                marginBottom: -1,
              }}>
              {f}
              <span style={{
                fontSize: 11, color: "var(--jr-fg-2)",
                fontFamily: "var(--jr-mono)", fontWeight: 400,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid var(--jr-border)", borderRadius: 10, overflow: "hidden", background: "var(--jr-card)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(180px,1fr) minmax(220px,1.4fr) 80px 120px 100px 40px",
          gap: 14, padding: "10px 16px",
          fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em",
          color: "var(--jr-fg-1)", background: "var(--jr-bg-1)",
          borderBottom: "1px solid var(--jr-border)",
        }}>
          <div>Company</div>
          <div>Role</div>
          <div>Match</div>
          <div>Status</div>
          <div>Date</div>
          <div></div>
        </div>
        {apps.map((a, i) => (
          <div key={a.id} className="jr-row" style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px,1fr) minmax(220px,1.4fr) 80px 120px 100px 40px",
            gap: 14, padding: "0 16px",
            alignItems: "center",
            height: "var(--jr-row-h)",
            borderTop: i ? "1px solid var(--jr-border)" : "none",
            cursor: "pointer", fontSize: 13.5,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--jr-ink)", fontWeight: 500 }}>
              <CompanyMark name={a.company}/>
              {a.company}
            </div>
            <div style={{ color: "var(--jr-fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.role}</div>
            <div style={{ fontFamily: "var(--jr-mono)", fontSize: 12.5, color: "var(--jr-fg)" }}>{a.match}%</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--jr-fg-1)", fontSize: 12.5 }}>
              <StatusDot status={a.status}/> {a.status}
            </div>
            <div style={{ fontFamily: "var(--jr-mono)", fontSize: 12, color: "var(--jr-fg-2)" }}>{a.date}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", color: "var(--jr-fg-2)" }}>
              <Icon name="chevron" size={14}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyMark({ name }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 5,
      background: "var(--jr-bg-2)",
      border: "1px solid var(--jr-border)",
      color: "var(--jr-fg-1)",
      fontSize: 10.5, fontWeight: 600,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      letterSpacing: 0,
    }}>{name.slice(0, 2).toUpperCase()}</span>
  );
}

// ─── Memory ──────────────────────────────────────────────────────────────────
function Memory() {
  const cats = Object.keys(D.memory);
  const [active, setActive] = React.useState("All");
  const [q, setQ] = React.useState("");

  const allFacts = React.useMemo(() => {
    const out = [];
    for (const cat of cats) for (const f of D.memory[cat]) out.push({ ...f, cat });
    return out;
  }, []);

  const visible = allFacts.filter(f =>
    (active === "All" || f.cat === active) &&
    (!q.trim() || f.text.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="jr-fade-in" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, height: "100%", minHeight: 0 }}>
      {/* Sub-sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em",
          color: "var(--jr-fg-1)", padding: "4px 8px", marginBottom: 4 }}>Memory</div>
        {[{ cat: "All", n: allFacts.length }, ...cats.map(c => ({ cat: c, n: D.memory[c].length }))].map(({ cat, n }) => (
          <button key={cat} onClick={() => setActive(cat)}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 8px", borderRadius: 6,
              background: active === cat ? "var(--jr-bg-2)" : "transparent",
              border: 0, color: active === cat ? "var(--jr-ink)" : "var(--jr-fg-1)",
              fontWeight: active === cat ? 500 : 400, fontSize: 13.5,
              cursor: "pointer", textAlign: "left",
            }}>
            <span>{cat}</span>
            <span style={{ fontFamily: "var(--jr-mono)", fontSize: 11.5, color: "var(--jr-fg-2)" }}>{n}</span>
          </button>
        ))}
        <div style={{ height: 1, background: "var(--jr-border)", margin: "10px 8px" }}/>
        <Button kind="ghost" icon="plus" size="sm" style={{ justifyContent: "flex-start", height: 28 }}>New category</Button>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <SectionHeader
          title={active === "All" ? "All facts" : active}
          subtitle="What JobMuse knows about you. Edit anything; it'll update tailored CVs going forward."
          right={
            <>
              <div style={{ position: "relative" }}>
                <Icon name="search" size={14} style={{
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  color: "var(--jr-fg-2)",
                }}/>
                <Input placeholder="Search facts…" value={q} onChange={(e) => setQ(e.target.value)}
                  style={{ width: 260, paddingLeft: 30 }}/>
              </div>
              <Button kind="primary" icon="plus">Add fact</Button>
            </>
          }
        />

        <div className="jr-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ border: "1px solid var(--jr-border)", borderRadius: 10, background: "var(--jr-card)", overflow: "hidden" }}>
            {visible.length === 0 && (
              <div style={{ padding: 32 }}>
                <Empty icon="memory" title="No facts here yet"
                  body="Try adding something simple — a recent project, a skill, a story you tell in interviews."/>
              </div>
            )}
            {visible.map((f, i) => (
              <div key={f.id} className="jr-row" style={{
                display: "grid", gridTemplateColumns: "100px 1fr 130px 100px 30px",
                gap: 14, padding: "12px 16px", alignItems: "center",
                borderTop: i ? "1px solid var(--jr-border)" : "none", cursor: "text",
              }}>
                <Pill style={{ justifySelf: "start" }}>{f.cat}</Pill>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--jr-fg)" }}>{f.text}</div>
                <div style={{ fontSize: 11.5, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)",
                  display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="tag" size={11}/>{f.source}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)" }}>{f.updated}</div>
                <div style={{ color: "var(--jr-fg-3)", display: "flex", justifyContent: "flex-end" }}>
                  <Icon name="chevron" size={13}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────────────────────
function Profile() {
  return (
    <div className="jr-fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <SectionHeader
        title="About you"
        subtitle="The basics. JobMuse uses these on every CV — keep them clean."
      />

      <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "14px 0 22px",
        borderBottom: "1px solid var(--jr-border)", marginBottom: 22 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999, background: "var(--jr-bg-3)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontWeight: 600, fontSize: 18, color: "var(--jr-ink)", letterSpacing: "-.01em",
        }}>{D.user.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: "var(--jr-ink)", fontSize: 14.5 }}>{D.user.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--jr-fg-1)" }}>{D.user.school}</div>
        </div>
        <Button kind="bordered" icon="upload">Replace photo</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div><FieldLabel>Full name</FieldLabel><Input defaultValue={D.user.name}/></div>
        <div><FieldLabel>Pronouns</FieldLabel><Input defaultValue="they/them"/></div>
        <div><FieldLabel>Email</FieldLabel><Input defaultValue={D.user.email}/></div>
        <div><FieldLabel>Phone</FieldLabel><Input defaultValue="—"/></div>
        <div><FieldLabel>Location</FieldLabel><Input defaultValue={D.user.location}/></div>
        <div><FieldLabel>Open to remote</FieldLabel><Input defaultValue="Yes"/></div>
        <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Personal site</FieldLabel><Input defaultValue="https://alexchen.dev"/></div>
        <div><FieldLabel>GitHub</FieldLabel><Input defaultValue="github.com/alxc"/></div>
        <div><FieldLabel>LinkedIn</FieldLabel><Input defaultValue="linkedin.com/in/alxc"/></div>
      </div>

      <FieldLabel>Default summary</FieldLabel>
      <Textarea rows={4} defaultValue="New-grad product engineer. Designer's eye, ship-focused. React, TypeScript, Figma."/>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        <Button kind="ghost">Discard</Button>
        <Button kind="primary" icon="check">Save changes</Button>
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function Settings() {
  const groups = [
    {
      title: "Tailoring",
      rows: [
        { label: "Default tone",       value: "Direct, almost terse" },
        { label: "CV length cap",      value: "1 page" },
        { label: "Auto-include projects", value: "If JD mentions \"build\"", toggle: true },
        { label: "Show change-log on results", value: "On", toggle: true },
      ]
    },
    {
      title: "Memory",
      rows: [
        { label: "Auto-capture from cover letters", value: "On", toggle: true },
        { label: "Confidence threshold", value: "0.65" },
        { label: "Forget facts older than", value: "Never" },
      ]
    },
    {
      title: "Export",
      rows: [
        { label: "Default format", value: "PDF (Letter)" },
        { label: "Filename pattern", value: "{name}__{company}__{role}.pdf", mono: true },
        { label: "Include source links",  value: "Off", toggle: false },
      ]
    },
    {
      title: "Account",
      rows: [
        { label: "Email", value: D.user.email },
        { label: "Plan",  value: "Student · free until graduation" },
      ]
    },
  ];

  return (
    <div className="jr-fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <SectionHeader title="Settings" subtitle="Defaults applied to every new application."/>
      {groups.map((g) => (
        <div key={g.title} style={{ marginBottom: 26 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: ".06em", color: "var(--jr-fg-1)" }}>{g.title}</h2>
          <div style={{ border: "1px solid var(--jr-border)", borderRadius: 10, overflow: "hidden", background: "var(--jr-card)" }}>
            {g.rows.map((r, i) => (
              <div key={r.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", borderTop: i ? "1px solid var(--jr-border)" : "none",
              }}>
                <span style={{ fontSize: 13.5, color: "var(--jr-fg)" }}>{r.label}</span>
                {r.toggle !== undefined ? (
                  <ToggleStub on={r.toggle && r.value !== "Off"}/>
                ) : (
                  <span style={{
                    fontSize: 13, color: "var(--jr-fg-1)",
                    fontFamily: r.mono ? "var(--jr-mono)" : undefined,
                  }}>{r.value}  ›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ToggleStub({ on }) {
  const [v, setV] = React.useState(!!on);
  return (
    <button onClick={() => setV(!v)} style={{
      width: 30, height: 18, borderRadius: 999,
      background: v ? "var(--jr-ink)" : "var(--jr-bg-3)",
      border: 0, position: "relative", cursor: "pointer", transition: "background .15s",
    }}>
      <span style={{
        position: "absolute", top: 2, left: v ? 14 : 2,
        width: 14, height: 14, borderRadius: 999,
        background: "var(--jr-bg)", transition: "left .15s",
      }}/>
    </button>
  );
}

Object.assign(window, { Dashboard, NewApplication, History, Memory, Profile, Settings });


// === app.jsx ===
// Main App shell for JobMuse — sidebar, routing, theme/density orchestration, tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "density": "cozy",
  "cvLayout": "split",
  "sidebar": "expanded",
  "showHints": true,
  "monoBrand": false
}/*EDITMODE-END*/;

const NAV = [
  { key: "home",     label: "Dashboard",       icon: "home" },
  { key: "new",      label: "New application", icon: "plus" },
  { key: "history",  label: "Applications",    icon: "history" },
  { key: "memory",   label: "Memory",          icon: "memory" },
  { key: "profile",  label: "About you",       icon: "user" },
  { key: "settings", label: "Settings",        icon: "settings" },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState("home");
  const [generated, setGenerated] = React.useState(false);

  // Inject button + animation styles once
  React.useEffect(() => {
    if (document.getElementById("__jr-btn-styles")) return;
    const s = document.createElement("style");
    s.id = "__jr-btn-styles";
    s.textContent = window.__JR_BTN_CSS;
    document.head.appendChild(s);
  }, []);

  // Apply theme + density to <html>
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.dark ? "dark" : "light");
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.dark, t.density]);

  // Cmd-K to jump to New
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setRoute("new");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const screen = (() => {
    switch (route) {
      case "home":     return <Dashboard go={setRoute} generated={generated}/>;
      case "new":      return <NewApplication generated={generated} setGenerated={setGenerated} layout={t.cvLayout}/>;
      case "history":  return <History/>;
      case "memory":   return <Memory/>;
      case "profile":  return <Profile/>;
      case "settings": return <Settings/>;
      default:         return null;
    }
  })();

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: t.sidebar === "collapsed" ? "56px 1fr" : "232px 1fr",
      height: "100vh", width: "100vw", overflow: "hidden",
      transition: "grid-template-columns .18s ease",
    }}>
      <Sidebar
        route={route} setRoute={setRoute}
        collapsed={t.sidebar === "collapsed"}
        toggleCollapsed={() => setTweak("sidebar", t.sidebar === "collapsed" ? "expanded" : "collapsed")}
        monoBrand={t.monoBrand}
      />
      <main className="jr-scroll" style={{
        overflowY: "auto", overflowX: "hidden",
        background: "var(--jr-bg)",
        padding: route === "memory" || route === "new" && generated ? "28px 32px" : "32px 40px",
        height: "100vh", display: "flex", flexDirection: "column",
        minWidth: 0,
      }}>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {screen}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Surface"/>
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)}/>
        <TweakRadio label="Density" value={t.density} options={["compact","cozy","roomy"]}
          onChange={(v) => setTweak("density", v)}/>
        <TweakRadio label="Sidebar" value={t.sidebar} options={["expanded","collapsed"]}
          onChange={(v) => setTweak("sidebar", v)}/>

        <TweakSection label="Result view"/>
        <TweakRadio label="CV layout" value={t.cvLayout}
          options={["split","cv-first","stacked"]}
          onChange={(v) => setTweak("cvLayout", v)}/>

        <TweakSection label="Surprise"/>
        <TweakToggle label="Mono brand mark" value={t.monoBrand}
          onChange={(v) => setTweak("monoBrand", v)}/>
        <TweakToggle label="Show coach hints" value={t.showHints}
          onChange={(v) => setTweak("showHints", v)}/>
        <TweakButton onClick={() => {
          // demo flow: jump to new + generate
          setGenerated(false);
          setRoute("new");
        }}>Replay JD → CV demo</TweakButton>
      </TweaksPanel>
    </div>
  );
}

function Sidebar({ route, setRoute, collapsed, toggleCollapsed, monoBrand }) {
  return (
    <aside style={{
      borderRight: "1px solid var(--jr-border)",
      background: "var(--jr-bg-1)",
      display: "flex", flexDirection: "column",
      padding: collapsed ? "10px 8px" : "10px 12px",
      gap: 4, height: "100vh", overflow: "hidden",
    }}>
      {/* Brand */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: collapsed ? "8px 4px" : "8px 8px 8px 6px",
        marginBottom: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
          <div style={{
            width: 22, height: 22, borderRadius: monoBrand ? 5 : 0,
            background: monoBrand ? "var(--jr-ink)" : "transparent",
            color: monoBrand ? "var(--jr-bg)" : "var(--jr-ink)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {monoBrand ? (
              <span style={{ fontFamily: "var(--jr-mono)", fontSize: 11, fontWeight: 700, letterSpacing: -0.5 }}>JM</span>
            ) : (
              <Icon name="logo" size={20} style={{ color: "var(--jr-ink)" }}/>
            )}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--jr-ink)", letterSpacing: "-.01em" }}>JobMuse</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button onClick={toggleCollapsed} style={{
            background: "none", border: 0, padding: 4, borderRadius: 4,
            cursor: "pointer", color: "var(--jr-fg-2)",
          }} title="Collapse">
            <Icon name="arrow-l" size={14}/>
          </button>
        )}
      </div>

      {/* User */}
      {!collapsed && (
        <button style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "6px 8px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "pointer",
          marginBottom: 8,
        }} className="jr-row">
          <span style={{
            width: 20, height: 20, borderRadius: 999, background: "var(--jr-bg-3)",
            color: "var(--jr-ink)", fontSize: 10, fontWeight: 600,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{D.user.initials}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--jr-fg)", flex: 1, textAlign: "left" }}>
            {D.user.name.split(" ")[0]}'s workspace
          </span>
          <Icon name="chev-down" size={12} style={{ color: "var(--jr-fg-2)" }}/>
        </button>
      )}

      {/* Search */}
      {!collapsed && (
        <div style={{ position: "relative", marginBottom: 4 }}>
          <Icon name="search" size={13} style={{
            position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
            color: "var(--jr-fg-2)", pointerEvents: "none",
          }}/>
          <input placeholder="Search…" className="jr-input" style={{
            width: "100%", height: 28, padding: "0 10px 0 27px",
            background: "var(--jr-bg)", border: "1px solid var(--jr-border)",
            borderRadius: 6, fontSize: 13, color: "var(--jr-fg)",
          }}/>
          <Kbd style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }}>⌘K</Kbd>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4 }}>
        {NAV.map((n) => {
          const active = route === n.key;
          return (
            <button key={n.key} onClick={() => setRoute(n.key)}
              title={collapsed ? n.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "7px" : "6px 8px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 6, border: 0,
                background: active ? "var(--jr-bg-3)" : "transparent",
                color: active ? "var(--jr-ink)" : "var(--jr-fg-1)",
                fontSize: 13.5, fontWeight: active ? 500 : 400,
                cursor: "pointer", textAlign: "left",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--jr-bg-2)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={n.icon} size={15} style={{ color: active ? "var(--jr-ink)" : "var(--jr-fg-1)" }}/>
              {!collapsed && <span>{n.label}</span>}
              {!collapsed && n.key === "history" && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)" }}>
                  {D.applications.length}
                </span>
              )}
              {!collapsed && n.key === "new" && (
                <Kbd style={{ marginLeft: "auto" }}>⌘K</Kbd>
              )}
            </button>
          );
        })}
      </nav>

      {/* Spacer + collapsed expand button + footer */}
      <div style={{ flex: 1 }}/>

      {collapsed && (
        <button onClick={toggleCollapsed} style={{
          background: "none", border: 0, padding: 8, borderRadius: 6,
          cursor: "pointer", color: "var(--jr-fg-2)",
          display: "flex", justifyContent: "center",
        }} title="Expand">
          <Icon name="arrow-r" size={14}/>
        </button>
      )}

      {!collapsed && (
        <div style={{
          padding: 12, borderRadius: 8, background: "var(--jr-bg-2)",
          border: "1px solid var(--jr-border)", marginTop: 10,
        }}>
          <div style={{ fontSize: 12, color: "var(--jr-fg-1)", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 500, color: "var(--jr-fg)", marginBottom: 4 }}>Free until graduation</div>
            Unlimited applications. Then $9/mo.
          </div>
        </div>
      )}
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);

