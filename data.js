// Mock data for JobMuse
window.JR_DATA = {
  user: {
    name: "Justin Lee",
    handle: "justin",
    email: "justin.lee@uni.edu",
    location: "Brooklyn, NY",
    school: "NYU — B.S. Computer Science, '25",
    initials: "JL",
  },

  applications: [
    { id: "a-1", company: "Linear",     role: "Associate Product Designer", date: "2026-05-06", status: "Draft",     match: 87 },
    { id: "a-2", company: "Figma",      role: "New Grad Software Engineer", date: "2026-05-04", status: "Applied",   match: 92 },
    { id: "a-3", company: "Notion",     role: "APM, Rotational Program",    date: "2026-05-03", status: "Interview", match: 81 },
    { id: "a-4", company: "Vercel",     role: "Frontend Engineer, Intern",  date: "2026-04-29", status: "Applied",   match: 78 },
    { id: "a-5", company: "Stripe",     role: "Software Engineer, New Grad",date: "2026-04-25", status: "Rejected",  match: 71 },
    { id: "a-6", company: "Anthropic",  role: "Research Engineer, New Grad",date: "2026-04-22", status: "Ghosted",   match: 64 },
    { id: "a-7", company: "Ramp",       role: "Product Engineer",           date: "2026-04-18", status: "Interview", match: 84 },
    { id: "a-8", company: "Arc",        role: "Design Engineer",            date: "2026-04-14", status: "Offer",     match: 95 },
    { id: "a-9", company: "Retool",     role: "Forward Deployed Engineer",  date: "2026-04-10", status: "Applied",   match: 76 },
    { id: "a-10",company: "Plaid",      role: "New Grad SWE",               date: "2026-04-05", status: "Rejected",  match: 68 },
  ],

  memory: {
    Experience: [
      { id: "m1", text: "Built a full-stack food-tracking app, Plate, with 1.2k weekly active users.",                             source: "resume.pdf",         updated: "2026-04-30" },
      { id: "m2", text: "Interned at Cloudflare summer 2024 on the Workers team. Shipped a request-coalescing cache.",            source: "linkedin",           updated: "2026-04-12" },
      { id: "m3", text: "TA'd Data Structures at NYU for three semesters. Held weekly office hours.",                              source: "manual",             updated: "2026-03-18" },
      { id: "m4", text: "Co-founded a hackathon club; ran 4 events with ~200 students each.",                                     source: "linkedin",           updated: "2026-03-02" },
    ],
    Skills: [
      { id: "m5", text: "Strong: TypeScript, React, Postgres, Python.",                                                             source: "resume.pdf",         updated: "2026-04-30" },
      { id: "m6", text: "Comfortable: Go, Swift, basic ML (PyTorch).",                                                              source: "manual",             updated: "2026-04-30" },
      { id: "m7", text: "Tools: Figma, Linear, Notion, Vercel, Supabase.",                                                          source: "manual",             updated: "2026-04-22" },
    ],
    Education: [
      { id: "m8", text: "NYU, B.S. Computer Science. Graduating May 2025. GPA 3.78.",                                              source: "resume.pdf",         updated: "2026-04-30" },
      { id: "m9", text: "Relevant coursework: Distributed Systems, Compilers, HCI, Algorithms.",                                   source: "resume.pdf",         updated: "2026-04-30" },
    ],
    Stories: [
      { id: "m10", text: "When the Plate launch traffic 50x'd overnight, debugged a connection-pool leak in 2 hours and shipped a fix.", source: "interview-prep", updated: "2026-04-08" },
      { id: "m11", text: "Convinced the hackathon team to scrap a 3-week prototype 24h before demo and rebuild around feedback. We won.", source: "interview-prep", updated: "2026-03-21" },
      { id: "m12", text: "Disagreed with my Cloudflare manager's caching design; wrote a doc, ran a benchmark, ended up shipping mine.",  source: "manual",          updated: "2026-03-02" },
    ],
    Preferences: [
      { id: "m13", text: "Wants to work in NYC or remote. Open to SF for the right team.",                                          source: "manual",             updated: "2026-04-30" },
      { id: "m14", text: "Strong preference for product-eng roles over pure infra.",                                                source: "manual",             updated: "2026-04-22" },
      { id: "m15", text: "Avoid: trading firms, defense, anything requiring on-call rotations >1/8.",                               source: "manual",             updated: "2026-04-22" },
    ],
    Achievements: [
      { id: "m16", text: "1st place — NYU Hack 2024. Built an offline-first notes app with CRDTs.",                                 source: "resume.pdf",         updated: "2026-04-30" },
      { id: "m17", text: "Dean's List, all six semesters.",                                                                          source: "resume.pdf",         updated: "2026-04-30" },
    ],
  },

  // Sample JD (Linear, Associate Product Designer)
  sampleJD: `Linear is looking for an Associate Product Designer to join our small, focused design team. You'll work on the core issue-tracking experience used by the world's best product teams.

What you'll do
• Design end-to-end features for our desktop and web apps
• Collaborate closely with engineers — we ship in days, not months
• Contribute to our design system and internal tooling
• Run user interviews and translate findings into product changes

What we're looking for
• 0–2 years of product design or related experience (new grads encouraged)
• Strong portfolio showing taste, craft, and clear thinking
• Comfort writing code (HTML/CSS at minimum) — most of our designers prototype in React
• Experience with TypeScript, Figma, and design systems is a plus
• Excellent written communication — we are a writing-first company

Nice to have
• Background in tools, productivity, or developer products
• Open-source contributions
• Experience running user research`,

  // Mock generated CV — used by the JD->CV flow
  generatedCV: {
    header: {
      name: "Justin Lee",
      contact: "justin.lee@uni.edu  ·  Brooklyn, NY  ·  justinchen.dev  ·  github.com/justlee",
    },
    summary: "New-grad product engineer with a designer's eye. Ship-focused — built and launched two products with real users. Comfortable in React, TypeScript, and Figma; write before I code.",
    experience: [
      {
        company: "Cloudflare",
        role: "Software Engineering Intern, Workers",
        dates: "Summer 2024",
        bullets: [
          "Designed and shipped a request-coalescing layer in the Workers runtime — cut origin load 38% on the top 1% of routes.",
          "Prototyped the change in TypeScript first, then ported to Rust; wrote the public-facing blog post and demo.",
          "Disagreed with the proposed caching key; wrote a 3-page doc, ran benchmarks, and got the team to adopt the alternative.",
        ],
        highlight: ["shipped", "TypeScript", "wrote", "doc"],
      },
      {
        company: "Plate (side project)",
        role: "Founder, Designer, Engineer",
        dates: "2024 — present",
        bullets: [
          "Designed and built a full-stack food-tracking app end-to-end. 1.2k weekly active users, organic.",
          "Owns design system, frontend (React/TypeScript), and Postgres backend. Ships features in days.",
          "Ran 14 user interviews; rewrote onboarding twice based on findings — D7 retention up from 22% to 41%.",
        ],
        highlight: ["Designed", "end-to-end", "design system", "React", "TypeScript", "user interviews"],
      },
      {
        company: "NYU Computer Science",
        role: "Teaching Assistant, Data Structures",
        dates: "2023 — 2024",
        bullets: [
          "Held weekly office hours for ~80 students. Wrote 6 problem sets adopted by the course.",
          "Distilled feedback from three semesters into a redesign of the recursion unit.",
        ],
        highlight: ["Wrote", "feedback", "redesign"],
      },
    ],
    projects: [
      { name: "Notes (CRDT)",   note: "Offline-first notes app. 1st place, NYU Hack 2024.",                  highlight: ["CRDT"] },
      { name: "Hackathon Club", note: "Co-founded; ran 4 events with ~200 students each.",                   highlight: ["ran"] },
    ],
    education: {
      school: "New York University",
      degree: "B.S. Computer Science, May 2025  ·  GPA 3.78",
      detail: "Coursework: Distributed Systems, Compilers, HCI, Algorithms.  ·  Dean's List, all semesters.",
    },
    skills: "TypeScript, React, Postgres, Python, Go, Figma, Linear, design systems, user research, technical writing.",
  },

  // Diff against the "base" CV — what got tailored
  cvChanges: [
    { section: "Summary",     note: "Reframed around 'designer's eye' + 'write before I code' — both pulled from JD." },
    { section: "Cloudflare",  note: "Surfaced the disagree-and-commit story; JD weights writing heavily." },
    { section: "Plate",       note: "Lifted 'design system' bullet to the top — JD lists this as a plus." },
    { section: "Skills",      note: "Reordered: TypeScript and Figma first; dropped infra-heavy items." },
  ],

  // Detected JD signals — used to highlight on the JD pane
  jdSignals: [
    { phrase: "product design",      kind: "role" },
    { phrase: "design system",       kind: "skill" },
    { phrase: "TypeScript",          kind: "skill" },
    { phrase: "Figma",               kind: "skill" },
    { phrase: "writing-first",       kind: "value" },
    { phrase: "writing",             kind: "value" },
    { phrase: "user interviews",     kind: "skill" },
    { phrase: "ship",                kind: "value" },
    { phrase: "new grads",           kind: "fit" },
    { phrase: "0–2 years",           kind: "fit" },
    { phrase: "developer products",  kind: "fit" },
    { phrase: "open-source",         kind: "skill" },
  ],
};
