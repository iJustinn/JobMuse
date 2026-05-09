import React from "react";
import { Icon, Kbd } from "./components/ui.jsx";
import {
  TweakButton,
  TweakRadio,
  TweakSection,
  TweakToggle,
  TweaksPanel,
  useTweaks,
} from "./components/TweaksPanel.jsx";
import { JR_DATA as D } from "./data.js";
import { Dashboard, History, Memory, NewApplication, Profile, Settings } from "./screens.jsx";

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

function useViewportWidth() {
  const readWidth = () => (typeof window === "undefined" ? 1280 : window.innerWidth);
  const [width, setWidth] = React.useState(readWidth);

  React.useEffect(() => {
    const onResize = () => setWidth(readWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState("home");
  const [generated, setGenerated] = React.useState(false);
  const width = useViewportWidth();
  const isMobile = width < 760;


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
      case "history":  return <History go={setRoute}/>;
      case "memory":   return <Memory/>;
      case "profile":  return <Profile/>;
      case "settings": return <Settings/>;
      default:         return null;
    }
  })();

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : t.sidebar === "collapsed" ? "56px 1fr" : "232px 1fr",
      gridTemplateRows: isMobile ? "auto minmax(0, 1fr)" : "1fr",
      height: "100dvh", width: "100vw", overflow: "hidden",
      transition: "grid-template-columns .18s ease",
    }}>
      <Sidebar
        route={route} setRoute={setRoute}
        collapsed={t.sidebar === "collapsed"}
        toggleCollapsed={() => setTweak("sidebar", t.sidebar === "collapsed" ? "expanded" : "collapsed")}
        monoBrand={t.monoBrand}
        mobile={isMobile}
      />
      <main className="jr-scroll" style={{
        overflowY: "auto", overflowX: "hidden",
        background: "var(--jr-bg)",
        padding: isMobile ? "18px 16px" : route === "memory" || route === "new" && generated ? "28px 32px" : "32px 40px",
        height: isMobile ? "auto" : "100vh", display: "flex", flexDirection: "column",
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

function Sidebar({ route, setRoute, collapsed, toggleCollapsed, monoBrand, mobile }) {
  const compact = collapsed && !mobile;

  return (
    <aside style={{
      borderRight: mobile ? 0 : "1px solid var(--jr-border)",
      borderBottom: mobile ? "1px solid var(--jr-border)" : 0,
      background: "var(--jr-bg-1)",
      display: "flex", flexDirection: "column",
      padding: compact ? "10px 8px" : mobile ? "8px 10px" : "10px 12px",
      gap: 4, height: mobile ? "auto" : "100vh", overflow: "hidden",
    }}>
      {/* Brand */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: compact ? "8px 4px" : "8px 8px 8px 6px",
        marginBottom: mobile ? 2 : 6,
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
          {!compact && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--jr-ink)", letterSpacing: "-.01em" }}>JobMuse</div>
            </div>
          )}
        </div>
        {!compact && !mobile && (
          <button onClick={toggleCollapsed} style={{
            background: "none", border: 0, padding: 4, borderRadius: 4,
            cursor: "pointer", color: "var(--jr-fg-2)",
          }} title="Collapse">
            <Icon name="arrow-l" size={14}/>
          </button>
        )}
      </div>

      {/* User */}
      {!compact && !mobile && (
        <button type="button" aria-disabled="true" title="Workspace switching is not implemented in this local prototype yet." style={{
          display: "flex", alignItems: "center", gap: 9,
          padding: "6px 8px", borderRadius: 6,
          background: "transparent", border: 0, cursor: "default",
          marginBottom: 8,
        }}>
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
      {!compact && !mobile && (
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
      <nav style={{
        display: "flex",
        flexDirection: mobile ? "row" : "column",
        gap: 1,
        marginTop: mobile ? 0 : 4,
        overflowX: mobile ? "auto" : undefined,
        paddingBottom: mobile ? 2 : undefined,
      }}>
        {NAV.map((n) => {
          const active = route === n.key;
          return (
            <button key={n.key} onClick={() => setRoute(n.key)}
              title={compact ? n.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: compact ? "7px" : "6px 8px",
                justifyContent: compact ? "center" : "flex-start",
                flexShrink: 0,
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
              {!compact && <span>{n.label}</span>}
              {!compact && !mobile && n.key === "history" && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--jr-fg-2)", fontFamily: "var(--jr-mono)" }}>
                  {D.applications.length}
                </span>
              )}
              {!compact && !mobile && n.key === "new" && (
                <Kbd style={{ marginLeft: "auto" }}>⌘K</Kbd>
              )}
            </button>
          );
        })}
      </nav>

      {/* Spacer + collapsed expand button + footer */}
      <div style={{ flex: 1 }}/>

      {compact && (
        <button onClick={toggleCollapsed} style={{
          background: "none", border: 0, padding: 8, borderRadius: 6,
          cursor: "pointer", color: "var(--jr-fg-2)",
          display: "flex", justifyContent: "center",
        }} title="Expand">
          <Icon name="arrow-r" size={14}/>
        </button>
      )}

      {!compact && !mobile && (
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
