// Public, non-private seed data for the local JobMuse prototype.
// Keep real resumes, emails, phone numbers, and API-backed data in ignored local files.
export const JR_DATA = {
  user: {
    name: "Alex Morgan",
    handle: "alex",
    email: "alex@example.com",
    alternateEmail: "",
    phone: "",
    location: "New York, NY / Remote",
    school: "Example University - M.S. Analytics, expected 2027",
    initials: "AM",
    website: "portfolio.example.com",
    github: "github.com/example",
    linkedIn: "",
    pronouns: "",
    remote: "Yes",
    defaultSummary:
      "Analytics graduate student with a statistics background. Builds data-heavy products with Python, SQL, R, JavaScript, and Swift; strongest at cleaning data, modeling trends, and turning analysis into usable dashboards and tools.",
  },

  applications: [
    { id: "a-1", company: "Cresta",     role: "Data Science Intern",              date: "2026-05-08", status: "Draft",     match: 91 },
    { id: "a-2", company: "Databricks", role: "Data Science Intern",              date: "2026-05-04", status: "Applied",   match: 86 },
    { id: "a-3", company: "Google",     role: "Product Analytics Intern",         date: "2026-05-03", status: "Interview", match: 82 },
    { id: "a-4", company: "OpenAI",     role: "AI Product Data Intern",           date: "2026-04-29", status: "Applied",   match: 80 },
    { id: "a-5", company: "Stripe",     role: "Data Analyst Intern",              date: "2026-04-25", status: "Rejected",  match: 74 },
    { id: "a-6", company: "Snowflake",  role: "Analytics Engineering Intern",     date: "2026-04-22", status: "Ghosted",   match: 76 },
    { id: "a-7", company: "Apple",      role: "iOS Data Apps Intern",             date: "2026-04-18", status: "Interview", match: 79 },
    { id: "a-8", company: "Waymo",      role: "Data Science Intern",              date: "2026-04-14", status: "Offer",     match: 78 },
    { id: "a-9", company: "NVIDIA",     role: "Machine Learning Data Intern",     date: "2026-04-10", status: "Applied",   match: 77 },
    { id: "a-10", company: "Microsoft", role: "Cloud Data Platform Intern",       date: "2026-04-05", status: "Rejected",  match: 73 },
  ],

  memory: {
    Experience: [
      { id: "m1", text: "Backend developer: added analytics modules with drill-down analysis by team and account.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m2", text: "Optimized SQL and backend data flow for filtering, improving aggregate response time by about 100 ms.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m3", text: "Built a privacy-focused spending tracker with category analytics, search/filter/sort, widgets, shortcuts, and multi-currency tracking.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m4", text: "Implemented on-device AI insights with deterministic local fallback for unsupported devices.", source: "demo-seed", updated: "2026-05-08" },
    ],
    Skills: [
      { id: "m5", text: "Programming languages: Python, Java, JavaScript, SQL, R, and Swift.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m6", text: "Data and visualization tools: tidyverse, dplyr, tidyr, ggplot2, Plotly, Leaflet, D3.js, and Scrollama.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m7", text: "Frameworks and tools: Spring Boot, SwiftUI, SwiftData, Git, Maven, Xcode, OracleDataModeler, and SQLDeveloper.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m8", text: "AI coding workflow: agentic workflow design, agent prompt engineering, and LLM output validation.", source: "demo-seed", updated: "2026-05-08" },
    ],
    Education: [
      { id: "m9", text: "Example University, M.S. Analytics, expected May 2027.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m10", text: "Example College, Statistics and Mathematics double major, July 2025.", source: "demo-seed", updated: "2026-05-08" },
    ],
    Stories: [
      { id: "m11", text: "Space-data project: built Java/Maven backend endpoints to fetch, process, and serve data from public APIs.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m12", text: "Supported large-scale data handling, missing/null-value error handling, Monte Carlo simulations, and orbital-dynamics calculations.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m13", text: "Cleaned environmental pollutant data and geographic shapefiles in R, then built an interactive web story with maps, charts, and health-impact visuals.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m14", text: "Processed housing-market data in R, handled missing values and time-series alignment, modeled long-term price trends, and built ggplot2 visualizations.", source: "demo-seed", updated: "2026-05-08" },
    ],
    Preferences: [
      { id: "m15", text: "Targeting data science, analytics, AI/product, and customer-facing technical problem-solving roles.", source: "manual", updated: "2026-05-08" },
      { id: "m16", text: "Open to fast-moving AI/product environments with mentorship, demos, feedback sessions, and practical data problems.", source: "manual", updated: "2026-05-08" },
    ],
    Achievements: [
      { id: "m17", text: "Founded and captained a high-school robotics team.", source: "demo-seed", updated: "2026-05-08" },
      { id: "m18", text: "Previously served as robotics driver and engineer, earning top-four finishes at international competitions.", source: "demo-seed", updated: "2026-05-08" },
    ],
  },

  sampleJD: `About the job
Cresta is on a mission to turn every customer conversation into a competitive advantage by unlocking the true potential of the contact center. Our platform combines the best of AI and human intelligence to help contact centers discover customer insights and behavioral best practices, automate conversations and inefficient processes, and empower every team member to work smarter and faster. Born from the prestigious Stanford AI lab, Cresta's co-founder and chairman is Sebastian Thrun, the genius behind Google X, Waymo, Udacity, and more. Our leadership also includes CEO, Ping Wu, the co-founder of Google Contact Center AI and Vertex AI platform, and co-founder, Tim Shi, an early member of Open AI.

Join us on this thrilling journey to revolutionize the workforce with AI. The future of work is here, and it's at Cresta.

About The Role

We are looking for a motivated Data Science Intern to join our team. This role offers hands-on experience working with real-world data, building models, and supporting data-driven decision-making. You will collaborate with data scientists, engineers, and business stakeholders to solve meaningful problems.

What You'll Do

Collect, clean, and preprocess structured and unstructured data
Perform exploratory data analysis to identify trends and insights
Build and evaluate machine learning models under guidance
Develop data visualizations and dashboards to communicate findings
Assist in deploying models and monitoring their performance
Work with large datasets using tools like Python, SQL, and cloud platforms
Document processes, experiments, and results clearly
Participate in team demos, feedback sessions, and learning opportunities.
This role provides mentorship and exposure to customer-facing technical problem solving in a fast-moving AI/Product environment.

What We're Looking For

Enrolled in a Bachelor’s or Master’s degree program in Computer Science, Engineering, or a related field.
Experience writing code in Python (or another general-purpose language).
Strong interest in artificial intelligence, machine learning, or software engineering.
Basic understanding of statistics and machine learning concepts
Familiarity with libraries such as Pandas, NumPy, Scikit-learn, or TensorFlow/PyTorch
Experience with SQL and working with databases
Strong analytical and problem-solving skills
Excellent communication skills and willingness to collaborate with teammates and customers.

Nice-to-Haves

Experience with data visualization tools (e.g., Tableau, Power BI, Matplotlib, Seaborn)
Familiarity with cloud platforms (AWS, GCP, or Azure)
Knowledge of version control (Git)
Exposure to big data tools (Spark, Hadoop) is a plus`,

  generatedCV: {
    header: {
      name: "Alex Morgan",
      contact: "alex@example.com  ·  New York, NY / Remote  ·  portfolio.example.com  ·  github.com/example",
    },
    summary: "Data science and analytics graduate student with a Statistics and Mathematics foundation. Experienced cleaning real-world datasets, building statistical models, writing Python/SQL/R code, and turning analysis into dashboards and data-heavy products. Interested in AI/product environments where customer-facing problems become measurable insights.",
    experience: [
      {
        company: "Retail Analytics App",
        role: "Backend Developer, Analytics Function Iteration",
        dates: "Jul 2024 - Aug 2024",
        bullets: [
          "Added three analytics modules with drill-down analysis by team and account, helping users compare ownership patterns and investigate individual records.",
          "Modified existing filter logic and added two filtering conditions plus a new interface for more detailed operational analysis.",
          "Optimized SQL logic and reduced unnecessary data transmission, improving aggregate calculation response time by approximately 100 ms after database reads.",
        ],
        highlight: ["SQL", "statistics", "100 ms", "analysis"],
      },
      {
        company: "Space Data Challenge",
        role: "Backend and Data Processing Contributor",
        dates: "Sep 2025 - Oct 2025",
        bullets: [
          "Designed Java/Maven backend endpoints to fetch, process, and serve data from multiple public APIs.",
          "Built data-processing logic for real-time and manual data fetching, including robust handling for large-scale scientific datasets and missing or null values.",
          "Supported Monte Carlo simulations and calculation workflows, then defined API contracts for interactive trajectory, hazard, and statistical dashboards.",
        ],
        highlight: ["large-scale", "data-processing", "Monte Carlo", "dashboards"],
      },
      {
        company: "Environmental Data Story",
        role: "Data Visualization Developer",
        dates: "Oct 2024 - Dec 2024",
        bullets: [
          "Retrieved and cleaned pollutant-release data and geographic shapefiles with R, tidyverse, and sf/rgdal.",
          "Built a multi-page interactive website with a Leaflet facility map, Plotly emissions breakdowns, and a health-impact visualization.",
          "Combined R analysis with JavaScript, D3.js, and Scrollama scrollytelling to communicate complex environmental data to non-technical audiences.",
        ],
        highlight: ["cleaned", "R", "Plotly", "visualization"],
      },
    ],
    projects: [
      { name: "Housing Price Trends", note: "Processed public housing data in R, aligned time-series data across regions and housing types, modeled long-term price trends, and visualized forecasts with ggplot2.", highlight: ["R", "time-series", "models", "ggplot2"] },
      { name: "Spending Tracker", note: "Built a SwiftUI spending tracker with category analytics, search/filter/sort, multi-currency conversion, JSON import/export, widgets, shortcuts, and on-device AI insights.", highlight: ["analytics", "SwiftUI", "AI insights"] },
      { name: "Media Manager using Spotify API", note: "Tested Spotify API flows in Java, built Java Swing GUI, and implemented add-song/search-song use cases.", highlight: ["API", "Java"] },
    ],
    education: {
      school: "Example University",
      degree: "M.S. Analytics, expected May 2027",
      detail: "Example College - B.A./B.S. Arts and Science, Statistics and Mathematics double major, July 2025.",
    },
    skills: "Python, SQL, R, Java, JavaScript, Swift, statistics, machine learning fundamentals, data cleaning, exploratory data analysis, ggplot2, Plotly, Leaflet, D3.js, Git, Maven, Spring Boot, SwiftUI.",
  },

  cvChanges: [
    { section: "Summary", note: "Reframed around data science, analytics, AI/product interest, and customer-facing insight work." },
    { section: "Retail Analytics", note: "Surfaced SQL optimization, analytics modules, and measurable backend performance improvement." },
    { section: "Space Data", note: "Highlighted large-scale data processing, Monte Carlo simulation support, and dashboard-facing API contracts." },
    { section: "Environmental Data", note: "Emphasized data cleaning, R analysis, visualization, and communication to non-technical audiences." },
    { section: "Skills", note: "Prioritized Python, SQL, R, statistics, EDA, visualization, Git, and machine-learning fundamentals for the Cresta JD." },
  ],

  jdSignals: [
    { phrase: "Data Science Intern", kind: "role" },
    { phrase: "real-world data", kind: "skill" },
    { phrase: "building models", kind: "skill" },
    { phrase: "data-driven decision-making", kind: "value" },
    { phrase: "Collect, clean, and preprocess", kind: "skill" },
    { phrase: "exploratory data analysis", kind: "skill" },
    { phrase: "machine learning models", kind: "skill" },
    { phrase: "data visualizations", kind: "skill" },
    { phrase: "dashboards", kind: "skill" },
    { phrase: "deploying models", kind: "skill" },
    { phrase: "large datasets", kind: "skill" },
    { phrase: "Python", kind: "skill" },
    { phrase: "SQL", kind: "skill" },
    { phrase: "cloud platforms", kind: "skill" },
    { phrase: "Document processes", kind: "value" },
    { phrase: "AI/Product environment", kind: "fit" },
    { phrase: "statistics", kind: "skill" },
    { phrase: "Pandas", kind: "skill" },
    { phrase: "NumPy", kind: "skill" },
    { phrase: "Scikit-learn", kind: "skill" },
    { phrase: "TensorFlow/PyTorch", kind: "skill" },
    { phrase: "databases", kind: "skill" },
    { phrase: "communication skills", kind: "value" },
    { phrase: "Git", kind: "skill" },
    { phrase: "Spark", kind: "skill" },
    { phrase: "Hadoop", kind: "skill" },
  ],
};
