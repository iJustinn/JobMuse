import { profileSchema } from "../../../shared/schemas/profile.js";
import { careerPath } from "../paths.js";
import { readJsonStat, readText } from "../io.js";
import { parseYaml } from "./yaml.js";

export async function parseProfileFile(config) {
  const filePath = careerPath(config, "config/profile.yml");
  const raw = await readText(filePath, "");
  const data = raw.trim() ? parseYaml(raw) : {};
  const advancedOverrides = await readText(careerPath(config, "modes/_profile.md"), "");
  const stat = await readJsonStat(filePath);
  return {
    raw,
    data: profileSchema.parse(normalizeProfile(data, advancedOverrides)),
    etag: stat.etag,
    path: filePath,
  };
}

function normalizeProfile(data = {}, advancedOverrides = "") {
  return {
    candidate: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio_url: "",
      github: "",
      ...(data.candidate || {}),
    },
    target_roles: {
      primary: [],
      archetypes: [],
      ...(data.target_roles || {}),
    },
    narrative: {
      headline: "",
      exit_story: "",
      superpowers: [],
      proof_points: [],
      ...(data.narrative || {}),
    },
    compensation: data.compensation || {},
    location: data.location || {},
    cv: data.cv || {},
    advancedOverrides,
  };
}
