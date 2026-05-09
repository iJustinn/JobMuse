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
