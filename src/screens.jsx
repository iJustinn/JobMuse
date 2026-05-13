import React from "react";
import { APPLICATION_STATUS_IDS, displayApplicationStatus } from "../shared/schemas/application.js";
import { apiGet, apiSend, useApiResource, useJobEvents } from "./lib/api.js";
import {
  Button,
  Empty,
  FieldLabel,
  Icon,
  Input,
  Pill,
  SectionHeader,
  StatusDot,
  Textarea,
} from "./components/ui.jsx";

function useViewportFlags() {
  const readWidth = () => (typeof window === "undefined" ? 1280 : window.innerWidth);
  const [width, setWidth] = React.useState(readWidth);
  React.useEffect(() => {
    const onResize = () => setWidth(readWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width, isNarrow: width < 980, isMobile: width < 720 };
}

export function Setup() {
  const setup = useApiResource("/system/setup", { noEvents: true });
  const checks = setup.data?.checks || [];
  return (
    <Page>
      <SectionHeader
        title="Setup"
        subtitle={setup.data?.careerOpsPath || "Checking career-ops"}
        right={<Button kind="bordered" icon="check" onClick={setup.reload}>Recheck</Button>}
      />
      <Panel>
        {setup.loading && <Muted>Checking setup...</Muted>}
        {setup.error && <ErrorBlock message={setup.error}/>}
        {checks.map((check) => (
          <div key={check.id} style={rowGrid("1fr auto")}>
            <div>
              <div style={strongText()}>{check.label}</div>
              <div style={mutedText({ marginTop: 2 })}>{check.message || check.path}</div>
            </div>
            <Pill style={check.ok ? positivePill() : check.required ? dangerPill() : undefined}>
              {check.ok ? "ready" : check.required ? "missing" : "optional"}
            </Pill>
          </div>
        ))}
      </Panel>
      <Panel title="Bootstrap commands">
        {(setup.data?.commands || []).map((command) => (
          <pre key={command} style={codeLine()}>{command}</pre>
        ))}
      </Panel>
    </Page>
  );
}

export function Dashboard({ go }) {
  const apps = useApiResource("/applications?sort=date");
  const pipeline = useApiResource("/pipeline");
  const reports = useApiResource("/reports?limit=5");
  const health = useApiResource("/insights/health", { noEvents: true });
  const rows = apps.data?.rows || [];
  const byStatus = countBy(rows, "status");
  const recent = rows.slice(0, 6);
  const { isMobile } = useViewportFlags();

  return (
    <Page>
      <SectionHeader
        title="Dashboard"
        subtitle="career-ops filesystem mirror"
        right={<Button kind="primary" icon="wand" onClick={() => go("evaluate")}>Evaluate</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        <Stat label="Applications" value={rows.length} hint={`${byStatus.applied || 0} applied`}/>
        <Stat label="Evaluated" value={byStatus.evaluated || 0} hint="pending decision"/>
        <Stat label="Pipeline" value={(pipeline.data?.rows || []).filter((row) => !row.checked).length} hint="pending URLs"/>
        <Stat label="Reports" value={(reports.data?.rows || []).length} hint={`${health.data?.missingReports || 0} missing links`}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 18 }}>
        <Panel title="Recent applications" action={<Button kind="ghost" size="sm" onClick={() => go("applications")}>Open</Button>}>
          {apps.error && <ErrorBlock message={apps.error}/>}
          {!apps.error && recent.length === 0 && <Empty title="No applications yet" body="Evaluate a job to create the first tracker row."/>}
          {recent.map((row) => <ApplicationRow key={row.num} row={row}/>)}
        </Panel>
        <Panel title="Recent reports" action={<Button kind="ghost" size="sm" onClick={() => go("reports")}>Open</Button>}>
          {(reports.data?.rows || []).length === 0 && <Empty title="No reports" body="Reports appear after evaluation modes write markdown files."/>}
          {(reports.data?.rows || []).map((report) => (
            <div key={report.filename} style={rowGrid("1fr auto")}>
              <div>
                <div style={strongText()}>{report.title}</div>
                <div style={mutedText()}>{report.filename}</div>
              </div>
              <Pill mono>{report.score ? `${report.score}/5` : "n/a"}</Pill>
            </div>
          ))}
        </Panel>
      </div>
    </Page>
  );
}

export function Evaluate() {
  const [form, setForm] = React.useState({ url: "", company: "", role: "", text: "" });
  const [jobId, setJobId] = React.useState("");
  const [error, setError] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const job = useJobEvents(jobId);

  async function submit() {
    setPending(true);
    setError("");
    try {
      const result = await apiSend("/applications/evaluate", { body: form });
      setJobId(result.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Page>
      <SectionHeader title="Evaluate" subtitle="oferta mode bridge" />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
        <Panel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <div><FieldLabel>Company</FieldLabel><Input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })}/></div>
            <div><FieldLabel>Role</FieldLabel><Input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}/></div>
          </div>
          <div style={{ marginTop: 12 }}><FieldLabel>Job URL</FieldLabel><Input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })}/></div>
          <div style={{ marginTop: 12 }}><FieldLabel>Job description text</FieldLabel><Textarea rows={12} value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })}/></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <Muted>{wordCount(form.text)} words</Muted>
            <Button kind="primary" icon="wand" disabled={pending || (!form.url.trim() && !form.text.trim())} onClick={submit}>
              {pending ? "Starting..." : "Run evaluation"}
            </Button>
          </div>
          {error && <ErrorBlock message={error}/>}
        </Panel>
        <JobLog jobId={jobId} events={job.events} done={job.done}/>
      </div>
    </Page>
  );
}

export function Applications() {
  const [status, setStatus] = React.useState("");
  const [search, setSearch] = React.useState("");
  const apps = useApiResource(`/applications?sort=date${status ? `&status=${status}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
  const [selected, setSelected] = React.useState(null);
  const { isMobile } = useViewportFlags();
  const rows = apps.data?.rows || [];

  return (
    <Page wide>
      <SectionHeader
        title="Applications"
        subtitle={`${rows.length} visible`}
        right={
          <>
            <Input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: 220 }}/>
            <select className="jr-input" value={status} onChange={(event) => setStatus(event.target.value)} style={selectStyle()}>
              <option value="">All statuses</option>
              {APPLICATION_STATUS_IDS.map((id) => <option key={id} value={id}>{displayApplicationStatus(id)}</option>)}
            </select>
          </>
        }
      />
      {apps.error && <ErrorBlock message={apps.error}/>}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.35fr) minmax(320px, .8fr)", gap: 18, minHeight: 0 }}>
        <Panel>
          {rows.length === 0 && <Empty title="No tracker rows" body="Rows come from career-ops data/applications.md."/>}
          {rows.map((row) => (
            <button key={row.num} onClick={() => setSelected(row.num)} className="jr-row" style={tableButton(selected === row.num)}>
              <ApplicationRow row={row}/>
            </button>
          ))}
        </Panel>
        <ApplicationDetail num={selected} etag={apps.data?.etag} onChanged={apps.reload}/>
      </div>
    </Page>
  );
}

function ApplicationDetail({ num, etag, onChanged }) {
  const [detail, setDetail] = React.useState(null);
  const [notes, setNotes] = React.useState("");
  const [status, setStatus] = React.useState("evaluated");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!num) {
      setDetail(null);
      return;
    }
    apiGet(`/applications/${num}`).then((data) => {
      setDetail(data);
      setNotes(data.row.notes || "");
      setStatus(data.row.status || "evaluated");
    }).catch((error) => setMessage(error.message));
  }, [num]);

  async function saveStatus(nextStatus = status) {
    if (!num) return;
    const data = await apiSend(`/applications/${num}/status`, { method: "PATCH", etag, body: { status: nextStatus } });
    setStatus(nextStatus);
    onChanged?.(data);
    setMessage("Status saved.");
  }

  async function saveNotes() {
    if (!num) return;
    const data = await apiSend(`/applications/${num}/notes`, { method: "PATCH", etag, body: { notes } });
    onChanged?.(data);
    setMessage("Notes saved.");
  }

  if (!num) return <Panel><Empty title="Select an application" body="Report details and write-back controls appear here."/></Panel>;
  if (!detail) return <Panel><Muted>Loading application...</Muted>{message && <ErrorBlock message={message}/>}</Panel>;

  return (
    <Panel title={`#${detail.row.num} ${detail.row.company}`}>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <FieldLabel>Status</FieldLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="jr-input" value={status} onChange={(event) => saveStatus(event.target.value)} style={selectStyle({ flex: 1 })}>
              {APPLICATION_STATUS_IDS.map((id) => <option key={id} value={id}>{displayApplicationStatus(id)}</option>)}
            </select>
          </div>
        </div>
        <div>
          <FieldLabel>Notes</FieldLabel>
          <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)}/>
          <Button kind="bordered" size="sm" icon="check" onClick={saveNotes} style={{ marginTop: 8 }}>Save notes</Button>
        </div>
        {message && <Muted>{message}</Muted>}
        <MarkdownPanel raw={detail.report?.raw || "No linked report found."} embedded/>
      </div>
    </Panel>
  );
}

export function Pipeline() {
  const pipeline = useApiResource("/pipeline");
  const [draft, setDraft] = React.useState("");
  const [message, setMessage] = React.useState("");
  const rows = pipeline.data?.rows || [];

  async function addUrl() {
    const data = await apiSend("/pipeline", { body: { url: draft }, etag: pipeline.data?.etag });
    pipeline.setData(data);
    setDraft("");
  }

  async function remove(idx) {
    const data = await apiSend(`/pipeline/${idx}`, { method: "DELETE", etag: pipeline.data?.etag });
    pipeline.setData(data);
  }

  async function process() {
    const job = await apiSend("/pipeline/process", { body: {} });
    setMessage(`Started job ${job.id}`);
  }

  return (
    <Page>
      <SectionHeader title="Pipeline" subtitle={`${rows.filter((row) => !row.checked).length} pending`} right={<Button kind="primary" onClick={process}>Process all</Button>}/>
      <Panel>
        <div style={{ display: "flex", gap: 8 }}>
          <Input placeholder="https://..." value={draft} onChange={(event) => setDraft(event.target.value)}/>
          <Button kind="bordered" icon="plus" disabled={!draft.trim()} onClick={addUrl}>Add</Button>
        </div>
        {pipeline.error && <ErrorBlock message={pipeline.error}/>}
        {message && <Muted>{message}</Muted>}
        <div style={{ marginTop: 14 }}>
          {rows.map((row) => (
            <div key={`${row.idx}-${row.url}`} style={rowGrid("1fr auto")}>
              <div>
                <div style={strongText()}>{row.role || row.url}</div>
                <div style={mutedText()}>{row.company || row.url}</div>
              </div>
              <Button kind="ghost" icon="trash" onClick={() => remove(row.idx)}>Remove</Button>
            </div>
          ))}
          {rows.length === 0 && <Empty title="Pipeline empty" body="Add URLs or run the scanner."/>}
        </div>
      </Panel>
    </Page>
  );
}

export function Memory() {
  const [tab, setTab] = React.useState("stories");
  const stories = useApiResource("/story-bank");
  const digest = useApiResource("/article-digest");
  const active = tab === "stories" ? stories : digest;
  const [raw, setRaw] = React.useState("");
  const [saved, setSaved] = React.useState("");

  React.useEffect(() => {
    setRaw(active.data?.raw || "");
  }, [active.data?.raw, tab]);

  async function save() {
    const path = tab === "stories" ? "/story-bank" : "/article-digest";
    const data = await apiSend(path, { method: "PUT", etag: active.data?.etag, body: { raw } });
    active.setData(data);
    setSaved("Saved.");
  }

  return (
    <Page>
      <SectionHeader
        title="Memory"
        subtitle={tab === "stories" ? "interview-prep/story-bank.md" : "article-digest.md"}
        right={<Segmented value={tab} onChange={setTab} options={[["stories", "Stories"], ["proof", "Proof points"]]}/>}
      />
      <Panel>
        {active.error && <ErrorBlock message={active.error}/>}
        <Textarea rows={24} value={raw} onChange={(event) => setRaw(event.target.value)} style={{ fontFamily: "var(--jr-mono)", fontSize: 12.5 }}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <Muted>{raw.length} chars</Muted>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saved && <Muted>{saved}</Muted>}
            <Button kind="primary" icon="check" onClick={save}>Save</Button>
          </div>
        </div>
      </Panel>
    </Page>
  );
}

export function Profile() {
  const profile = useApiResource("/profile");
  const [data, setData] = React.useState(null);
  const [saved, setSaved] = React.useState("");

  React.useEffect(() => {
    if (profile.data?.data) setData(profile.data.data);
  }, [profile.data?.data]);

  function update(path, value) {
    setData((current) => setNested(current || {}, path, value));
  }

  async function save() {
    const result = await apiSend("/profile", { method: "PUT", etag: profile.data?.etag, body: { data } });
    profile.setData(result);
    setSaved("Saved.");
  }

  if (profile.loading || !data) return <Page><SectionHeader title="Profile"/><Panel><Muted>Loading profile...</Muted></Panel></Page>;

  return (
    <Page>
      <SectionHeader title="Profile" subtitle="config/profile.yml"/>
      <Panel>
        {profile.error && <ErrorBlock message={profile.error}/>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <TextField label="Full name" value={data.candidate?.full_name} onChange={(value) => update(["candidate", "full_name"], value)}/>
          <TextField label="Email" value={data.candidate?.email} onChange={(value) => update(["candidate", "email"], value)}/>
          <TextField label="Phone" value={data.candidate?.phone} onChange={(value) => update(["candidate", "phone"], value)}/>
          <TextField label="Location" value={data.candidate?.location} onChange={(value) => update(["candidate", "location"], value)}/>
          <TextField label="LinkedIn" value={data.candidate?.linkedin} onChange={(value) => update(["candidate", "linkedin"], value)}/>
          <TextField label="Portfolio" value={data.candidate?.portfolio_url} onChange={(value) => update(["candidate", "portfolio_url"], value)}/>
        </div>
        <div style={{ marginTop: 12 }}>
          <FieldLabel>Primary roles</FieldLabel>
          <Textarea rows={3} value={(data.target_roles?.primary || []).join("\n")} onChange={(event) => update(["target_roles", "primary"], event.target.value.split("\n").filter(Boolean))}/>
        </div>
        <div style={{ marginTop: 12 }}>
          <FieldLabel>Headline</FieldLabel>
          <Input value={data.narrative?.headline || ""} onChange={(event) => update(["narrative", "headline"], event.target.value)}/>
        </div>
        <div style={{ marginTop: 12 }}>
          <FieldLabel>Archetypes & overrides</FieldLabel>
          <Textarea rows={8} value={data.advancedOverrides || ""} onChange={(event) => update(["advancedOverrides"], event.target.value)} style={{ fontFamily: "var(--jr-mono)", fontSize: 12.5 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 14 }}>
          {saved && <Muted>{saved}</Muted>}
          <Button kind="primary" icon="check" onClick={save}>Save profile</Button>
        </div>
      </Panel>
    </Page>
  );
}

export function Scan() {
  const portals = useApiResource("/portals");
  const history = useApiResource("/scan/history");
  const [raw, setRaw] = React.useState("");
  const [jobId, setJobId] = React.useState("");
  const job = useJobEvents(jobId);

  React.useEffect(() => {
    setRaw(portals.data?.raw || "");
  }, [portals.data?.raw]);

  async function save() {
    const result = await apiSend("/portals", { method: "PUT", etag: portals.data?.etag, body: { raw } });
    portals.setData(result);
  }

  async function runScan(dryRun = false) {
    const result = await apiSend("/scan", { body: { dryRun } });
    setJobId(result.id);
  }

  return (
    <Page wide>
      <SectionHeader title="Scan" subtitle="portals.yml" right={<><Button kind="bordered" onClick={() => runScan(true)}>Dry run</Button><Button kind="primary" onClick={() => runScan(false)}>Run scan</Button></>}/>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .8fr)", gap: 18 }}>
        <Panel title={`${portals.data?.portals?.length || 0} tracked companies`}>
          {portals.error && <ErrorBlock message={portals.error}/>}
          <Textarea rows={28} value={raw} onChange={(event) => setRaw(event.target.value)} style={{ fontFamily: "var(--jr-mono)", fontSize: 12 }}/>
          <Button kind="primary" icon="check" onClick={save} style={{ marginTop: 10 }}>Save portals</Button>
        </Panel>
        <div style={{ display: "grid", gap: 18 }}>
          <JobLog jobId={jobId} events={job.events} done={job.done}/>
          <Panel title="Scan history">
            {(history.data?.rows || []).slice(0, 8).map((row, index) => (
              <div key={index} style={rowGrid("1fr")}>
                <div style={strongText()}>{row.company || row.url || JSON.stringify(row)}</div>
                <div style={mutedText()}>{row.title || row.date || ""}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </Page>
  );
}

export function Reports() {
  const reports = useApiResource("/reports?sort=date");
  const [selected, setSelected] = React.useState("");
  const [detail, setDetail] = React.useState(null);

  React.useEffect(() => {
    if (!selected) return;
    apiGet(`/reports/${selected}`).then(setDetail).catch((error) => setDetail({ raw: error.message }));
  }, [selected]);

  return (
    <Page wide>
      <SectionHeader title="Reports" subtitle={`${reports.data?.rows?.length || 0} markdown files`}/>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, .7fr) minmax(0, 1.3fr)", gap: 18 }}>
        <Panel>
          {(reports.data?.rows || []).map((report) => (
            <button key={report.filename} onClick={() => setSelected(report.filename)} style={tableButton(selected === report.filename)}>
              <div style={rowGrid("1fr auto")}>
                <div>
                  <div style={strongText()}>{report.title}</div>
                  <div style={mutedText()}>{report.filename}</div>
                </div>
                <Pill mono>{report.score ? `${report.score}/5` : "n/a"}</Pill>
              </div>
            </button>
          ))}
        </Panel>
        <MarkdownPanel raw={detail?.raw || "Select a report."}/>
      </div>
    </Page>
  );
}

export function Insights() {
  const patterns = useApiResource("/insights/patterns", { noEvents: true });
  const followups = useApiResource("/insights/followups", { noEvents: true });
  const health = useApiResource("/insights/health", { noEvents: true });

  return (
    <Page>
      <SectionHeader title="Insights" subtitle="career-ops script outputs and fallbacks"/>
      <div style={{ display: "grid", gap: 18 }}>
        <JsonPanel title="Patterns" data={patterns.data} error={patterns.error}/>
        <JsonPanel title="Follow-ups" data={followups.data} error={followups.error}/>
        <JsonPanel title="Pipeline health" data={health.data} error={health.error}/>
      </div>
    </Page>
  );
}

export function Settings() {
  const setup = useApiResource("/system/setup", { noEvents: true });
  const llm = useApiResource("/system/llm", { noEvents: true });
  const [message, setMessage] = React.useState("");

  async function updateCheck() {
    const job = await apiSend("/system/update/check", { body: {} });
    setMessage(`Started update check ${job.id}`);
  }

  return (
    <Page>
      <SectionHeader title="Settings" subtitle="local career-ops integration" right={<Button kind="bordered" onClick={updateCheck}>Update check</Button>}/>
      <Panel title="career-ops">
        <KeyValue label="Path" value={setup.data?.careerOpsPath || ""}/>
        <KeyValue label="Source" value={setup.data?.source || ""}/>
        <KeyValue label="Setup" value={setup.data?.ok ? "ready" : "incomplete"}/>
      </Panel>
      <Panel title="LLM">
        <KeyValue label="Provider" value={llm.data?.provider || ""}/>
        <KeyValue label="Model" value={llm.data?.model || ""}/>
        <KeyValue label="Configured" value={llm.data?.configured ? "yes" : "no"}/>
      </Panel>
      {message && <Muted>{message}</Muted>}
    </Page>
  );
}

function Page({ children, wide = false }) {
  return <div className="jr-fade-in" style={{ maxWidth: wide ? 1180 : 920, margin: "0 auto", width: "100%" }}>{children}</div>;
}

function Panel({ title, action, children }) {
  return (
    <section style={{ border: "1px solid var(--jr-border)", borderRadius: 8, background: "var(--jr-card)", overflow: "hidden", marginBottom: 18 }}>
      {(title || action) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid var(--jr-border)", background: "var(--jr-bg-1)" }}>
          <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--jr-ink)" }}>{title}</h2>
          {action}
        </div>
      )}
      <div style={{ padding: 14 }}>{children}</div>
    </section>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div style={{ border: "1px solid var(--jr-border)", borderRadius: 8, padding: "14px 16px", background: "var(--jr-card)" }}>
      <div style={{ fontSize: 11.5, color: "var(--jr-fg-1)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color: "var(--jr-ink)", marginTop: 6 }}>{value}</div>
      <div style={mutedText()}>{hint}</div>
    </div>
  );
}

function ApplicationRow({ row }) {
  return (
    <div style={rowGrid("56px minmax(0, 1fr) 72px 110px")}>
      <span style={{ fontFamily: "var(--jr-mono)", color: "var(--jr-fg-2)" }}>#{row.num}</span>
      <div style={{ minWidth: 0 }}>
        <div style={strongText()}>{row.company}</div>
        <div style={{ ...mutedText(), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.role}</div>
      </div>
      <Pill mono>{row.scoreText || "n/a"}</Pill>
      <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--jr-fg-1)", fontSize: 12.5 }}>
        <StatusDot status={displayApplicationStatus(row.status)}/> {displayApplicationStatus(row.status)}
      </div>
    </div>
  );
}

function JobLog({ jobId, events, done }) {
  return (
    <Panel title={jobId ? `Job ${jobId.slice(0, 8)}` : "Job log"}>
      {!jobId && <Muted>No job running.</Muted>}
      {jobId && events.length === 0 && <Muted>Waiting for events...</Muted>}
      <div style={{ display: "grid", gap: 6, maxHeight: 320, overflow: "auto" }}>
        {events.map((event, index) => (
          <pre key={index} style={logLine(event.type)}>{typeof event.data === "string" ? event.data : JSON.stringify(event.data)}</pre>
        ))}
      </div>
      {jobId && done && <Pill style={{ marginTop: 10, ...positivePill() }}>done</Pill>}
    </Panel>
  );
}

function MarkdownPanel({ raw, embedded = false }) {
  if (embedded) {
    return (
      <div>
        <FieldLabel>Report markdown</FieldLabel>
        <pre style={{ ...codeBlock(), maxHeight: 420 }}>{raw}</pre>
      </div>
    );
  }
  return (
    <Panel title="Markdown">
      <pre style={{ ...codeBlock(), maxHeight: 620 }}>{raw}</pre>
    </Panel>
  );
}

function JsonPanel({ title, data, error }) {
  return (
    <Panel title={title}>
      {error ? <ErrorBlock message={error}/> : <pre style={codeBlock()}>{typeof data?.stdout === "string" ? data.stdout : JSON.stringify(data, null, 2)}</pre>}
    </Panel>
  );
}

function TextField({ label, value, onChange }) {
  return <div><FieldLabel>{label}</FieldLabel><Input value={value || ""} onChange={(event) => onChange(event.target.value)}/></div>;
}

function KeyValue({ label, value }) {
  return (
    <div style={rowGrid("160px 1fr")}>
      <div style={mutedText()}>{label}</div>
      <div style={{ ...strongText(), overflowWrap: "anywhere" }}>{value || "-"}</div>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", padding: 2, border: "1px solid var(--jr-border)", borderRadius: 6, background: "var(--jr-bg-1)" }}>
      {options.map(([id, label]) => (
        <button key={id} onClick={() => onChange(id)} style={{
          border: 0,
          borderRadius: 4,
          padding: "5px 10px",
          background: value === id ? "var(--jr-card)" : "transparent",
          color: value === id ? "var(--jr-ink)" : "var(--jr-fg-1)",
          fontSize: 12.5,
          cursor: "pointer",
        }}>{label}</button>
      ))}
    </div>
  );
}

function ErrorBlock({ message }) {
  return <div style={{ marginTop: 10, padding: "9px 10px", border: "1px solid var(--jr-danger, #c2410c)", borderRadius: 6, color: "var(--jr-fg)", background: "var(--jr-bg-1)", fontSize: 12.5 }}>{message}</div>;
}

function Muted({ children }) {
  return <div style={mutedText()}>{children}</div>;
}

function countBy(rows, key) {
  return rows.reduce((out, row) => {
    out[row[key]] = (out[row[key]] || 0) + 1;
    return out;
  }, {});
}

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function setNested(object, path, value) {
  const clone = structuredClone(object || {});
  let current = clone;
  for (const key of path.slice(0, -1)) {
    current[key] = current[key] && typeof current[key] === "object" ? current[key] : {};
    current = current[key];
  }
  current[path[path.length - 1]] = value;
  return clone;
}

function rowGrid(columns) {
  return {
    display: "grid",
    gridTemplateColumns: columns,
    gap: 12,
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid var(--jr-border)",
  };
}

function tableButton(active) {
  return {
    width: "100%",
    display: "block",
    textAlign: "left",
    border: 0,
    borderRadius: 6,
    background: active ? "var(--jr-bg-2)" : "transparent",
    color: "inherit",
    cursor: "pointer",
    padding: "0 10px",
  };
}

function selectStyle(extra = {}) {
  return {
    height: 32,
    border: "1px solid var(--jr-border)",
    borderRadius: 6,
    background: "var(--jr-bg-1)",
    color: "var(--jr-fg)",
    fontSize: 13,
    padding: "0 10px",
    ...extra,
  };
}

function mutedText(extra = {}) {
  return { fontSize: 12.5, color: "var(--jr-fg-2)", ...extra };
}

function strongText(extra = {}) {
  return { fontSize: 13.5, fontWeight: 500, color: "var(--jr-ink)", ...extra };
}

function positivePill() {
  return { background: "rgba(22, 101, 52, .12)", color: "rgb(22, 101, 52)" };
}

function dangerPill() {
  return { background: "rgba(194, 65, 12, .12)", color: "rgb(194, 65, 12)" };
}

function codeLine() {
  return { margin: "6px 0", padding: "8px 10px", borderRadius: 6, background: "var(--jr-bg-1)", border: "1px solid var(--jr-border)", overflowX: "auto", fontSize: 12, color: "var(--jr-fg)" };
}

function codeBlock() {
  return { margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "auto", fontFamily: "var(--jr-mono)", fontSize: 12.5, lineHeight: 1.55, color: "var(--jr-fg)" };
}

function logLine(type) {
  return {
    ...codeLine(),
    borderColor: type === "stderr" || type === "error" ? "rgba(194, 65, 12, .4)" : "var(--jr-border)",
  };
}
