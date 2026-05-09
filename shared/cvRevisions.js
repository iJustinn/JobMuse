export function buildLocalCvRevision({ message = "", currentCv, model = "deepseek-v4-flash", source = "mock" }) {
  const text = String(message || "");
  const normalized = text.toLowerCase();
  const cv = cloneCv(currentCv);

  let patch = "Revision";
  let reply = "Done. Updated the CV draft so the visible content matches your instruction.";

  if (/summary/.test(normalized) && /remove|delete|drop|get rid|without|no summary/.test(normalized)) {
    cv.summary = "";
    patch = "Summary";
    reply = "Removed the summary section from your CV.";
  } else if (/one page|1 page|shorten|short|tight|concise|trim|cut/.test(normalized)) {
    cv.summary = shortenSentence(cv.summary, 135);
    cv.experience = cv.experience.map((job, index) => ({
      ...job,
      bullets: index === 0 ? job.bullets.slice(0, 2) : job.bullets.slice(0, 1),
    })).slice(0, 2);
    cv.projects = cv.projects.slice(0, 1);
    patch = /one page|1 page/.test(normalized) ? "Length" : "Summary";
    reply = "Condensed the CV for a tighter one-page version.";
  } else if (/metric|number|quant|impact|result|sql/.test(normalized)) {
    cv.experience = cv.experience.map((job) => {
      if (!/xiaomi/i.test(job.company)) return job;
      return {
        ...job,
        bullets: uniqueBullets([
          "Optimized SQL logic and reduced unnecessary data transfer, improving total clue-count response time by approximately 100 ms after database reads.",
          ...job.bullets,
        ]),
        highlight: uniqueBullets([...(job.highlight || []), "SQL", "100 ms", "response time"]),
      };
    });
    patch = "Metrics";
    reply = "Added stronger quantified backend and SQL impact to the most relevant experience bullet.";
  } else if (/nasa|large-scale|monte carlo|dashboard|api|data processing/.test(normalized)) {
    cv.experience = cv.experience.map((job) => {
      if (!/nasa/i.test(job.company)) return job;
      const dataBullet = job.bullets.find((bullet) => /large-scale|Monte Carlo|dashboard|NASA APIs/i.test(bullet));
      if (!dataBullet) return job;
      return {
        ...job,
        bullets: uniqueBullets([dataBullet, ...job.bullets]),
        highlight: uniqueBullets([...(job.highlight || []), "large-scale", "Monte Carlo", "dashboards", "NASA APIs"]),
      };
    });
    patch = "NASA";
    reply = "Moved the NASA data-processing work higher so the CV leads with large-dataset and dashboard evidence.";
  } else if (/tone|voice|cresta|direct|plain|less buzz|ai product/.test(normalized)) {
    cv.summary = toneDownSummary(cv.summary);
    cv.experience = cv.experience.map((job) => ({
      ...job,
      bullets: job.bullets.map((bullet) => bullet.replace(/\s+—\s+/g, ". ")),
    }));
    patch = "Tone";
    reply = "Adjusted the CV toward a more direct, Cresta-style AI/product voice.";
  } else if (/skill|python|sql|r|statistics|machine learning|visualization|git/.test(normalized)) {
    cv.skills = reorderSkills(cv.skills, ["Python", "SQL", "R", "statistics", "machine learning fundamentals", "data cleaning", "exploratory data analysis", "ggplot2", "Plotly", "Git"]);
    patch = "Skills";
    reply = "Reordered the skills section around the strongest JD matches.";
  }

  return {
    reply,
    patch,
    cv,
    changes: [{ section: patch, note: reply }],
    model,
    source,
  };
}

function cloneCv(currentCv) {
  return structuredCloneSafe(currentCv || {
    header: { name: "", contact: "" },
    summary: "",
    experience: [],
    projects: [],
    education: { school: "", degree: "", detail: "" },
    skills: "",
  });
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function shortenSentence(value = "", maxLength) {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${clipped}.`;
}

function toneDownSummary(value = "") {
  const text = String(value);
  if (/Data science and analytics graduate student/i.test(text)) {
    return "Data science intern candidate with a Statistics and Mathematics foundation. Turns messy real-world data into models, dashboards, and product decisions using Python, SQL, and R.";
  }
  return text.replace(/Experienced /i, "Works on ").replace(/Interested in /i, "Targets ");
}

function reorderSkills(value = "", priority = []) {
  const skills = String(value).split(",").map((skill) => skill.trim()).filter(Boolean);
  const lowerSkills = new Map(skills.map((skill) => [skill.toLowerCase(), skill]));
  const first = priority
    .map((skill) => lowerSkills.get(skill.toLowerCase()))
    .filter(Boolean);
  const rest = skills.filter((skill) => !first.some((item) => item.toLowerCase() === skill.toLowerCase()));
  return uniqueBullets([...first, ...rest]).join(", ");
}

function uniqueBullets(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
