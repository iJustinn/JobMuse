export function parseYaml(text = "") {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const root = {};
  const stack = [{ indent: -1, value: root }];

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const indent = raw.match(/^ */)?.[0].length || 0;
    const line = stripInlineComment(raw.trim());
    if (!line) continue;

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].value;
    if (line.startsWith("- ")) {
      if (!Array.isArray(parent)) continue;
      const itemText = line.slice(2).trim();
      if (itemText.includes(":")) {
        const [key, rest] = splitKeyValue(itemText);
        const item = {};
        item[key] = parseYamlScalar(rest);
        parent.push(item);
        if (rest === "") stack.push({ indent, value: item });
      } else {
        parent.push(parseYamlScalar(itemText));
      }
      continue;
    }

    const [key, rest] = splitKeyValue(line);
    if (!key) continue;
    const next = nextContentLine(lines, index + 1);
    const value = rest === ""
      ? next?.trimmed.startsWith("- ") ? [] : {}
      : parseYamlScalar(rest);

    if (Array.isArray(parent)) {
      const item = { [key]: value };
      parent.push(item);
      if (rest === "") stack.push({ indent, value: item[key] });
    } else if (parent && typeof parent === "object") {
      parent[key] = value;
      if (rest === "") stack.push({ indent, value });
    }
  }

  return root;
}

export function stringifyYaml(value, indent = 0) {
  if (!value || typeof value !== "object") return `${formatYamlScalar(value)}\n`;
  const pad = " ".repeat(indent);
  let output = "";

  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const entries = Object.entries(item);
        if (entries.length === 0) {
          output += `${pad}- {}\n`;
          continue;
        }
        const [firstKey, firstValue] = entries[0];
        if (isNested(firstValue)) {
          output += `${pad}- ${firstKey}:\n${stringifyYaml(firstValue, indent + 4)}`;
        } else {
          output += `${pad}- ${firstKey}: ${formatYamlScalar(firstValue)}\n`;
        }
        for (const [key, nestedValue] of entries.slice(1)) {
          output += formatYamlEntry(key, nestedValue, indent + 2);
        }
      } else {
        output += `${pad}- ${formatYamlScalar(item)}\n`;
      }
    }
    return output;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    output += formatYamlEntry(key, nestedValue, indent);
  }
  return output;
}

function formatYamlEntry(key, value, indent) {
  const pad = " ".repeat(indent);
  if (isNested(value)) {
    return `${pad}${key}:\n${stringifyYaml(value, indent + 2)}`;
  }
  return `${pad}${key}: ${formatYamlScalar(value)}\n`;
}

function isNested(value) {
  return value && typeof value === "object";
}

function splitKeyValue(line) {
  const idx = line.indexOf(":");
  if (idx === -1) return [line.trim(), ""];
  return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
}

function parseYamlScalar(value) {
  const clean = String(value || "").trim();
  if (clean === "") return "";
  if (clean === "true") return true;
  if (clean === "false") return false;
  if (clean === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(clean)) return Number(clean);
  if (clean.startsWith("[") && clean.endsWith("]")) {
    const inner = clean.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((part) => parseYamlScalar(part.trim()));
  }
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    return clean.slice(1, -1).replace(/\\"/g, '"');
  }
  return clean;
}

function formatYamlScalar(value) {
  if (value === null || value === undefined) return '""';
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  const text = String(value);
  if (!text) return '""';
  if (/^[A-Za-z0-9_./:@+\-\s]+$/.test(text) && !/^[-?:,.[\]{}#&*!|>'"%@`]/.test(text)) {
    return text;
  }
  return JSON.stringify(text);
}

function nextContentLine(lines, start) {
  for (let index = start; index < lines.length; index += 1) {
    const raw = lines[index];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    return { raw, trimmed: raw.trim() };
  }
  return null;
}

function stripInlineComment(line) {
  let quote = "";
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if ((char === '"' || char === "'") && line[index - 1] !== "\\") {
      quote = quote === char ? "" : quote || char;
    }
    if (char === "#" && !quote && /\s/.test(line[index - 1] || " ")) {
      return line.slice(0, index).trim();
    }
  }
  return line;
}
