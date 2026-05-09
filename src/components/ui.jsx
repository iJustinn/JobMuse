import React from "react";

// Shared UI primitives for JobMuse.
// Icons: line-style, 16px, drawn fresh — kept geometric & simple.

export const Icon = ({ name, size = 16, stroke = 1.5, style }) => {
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
export const Button = ({ children, kind = "ghost", size = "md", icon, iconRight, onClick, disabled, style, type = "button", title }) => {
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

// Status dot for application status
export const StatusDot = ({ status }) => {
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

export const Pill = ({ children, mono, style }) => (
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

export const Kbd = ({ children, style, ...rest }) => (
  <kbd {...rest} style={{
    fontFamily: "var(--jr-mono)", fontSize: 11,
    padding: "1px 5px", borderRadius: 4,
    border: "1px solid var(--jr-border-1)",
    background: "var(--jr-card)",
    color: "var(--jr-fg-1)",
    minWidth: 16, display: "inline-flex", justifyContent: "center",
    ...style,
  }}>{children}</kbd>
);

export const SectionHeader = ({ title, subtitle, right, sticky }) => (
  <div style={{
    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
    gap: 16, padding: "0 0 14px", flexWrap: "wrap",
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
    {right && <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{right}</div>}
  </div>
);

// Subtle field label
export const FieldLabel = ({ children }) => (
  <label style={{
    display: "block", fontSize: 11.5, fontWeight: 500,
    color: "var(--jr-fg-1)", letterSpacing: ".02em",
    textTransform: "uppercase", marginBottom: 6,
  }}>{children}</label>
);

export const Input = React.forwardRef(({ style, ...rest }, ref) => (
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

export const Textarea = ({ style, ...rest }) => (
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
export const Empty = ({ icon = "doc", title, body, action }) => (
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
export function highlightText(text, phrases) {
  if (!phrases || !phrases.length) return text;
  // Escape regex
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${phrases.map(p => esc(p.phrase || p)).join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? <mark key={i} className="jr-mark">{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
  );
}
