import fs from "node:fs";
import path from "node:path";
import { USER_LAYER_PATHS, careerPath, getCareerOpsRoot } from "./paths.js";

const subscribers = new Set();
let watchers = [];

export function startCareerOpsWatcher(config) {
  if (watchers.length) return;
  const root = getCareerOpsRoot(config);
  for (const relativePath of USER_LAYER_PATHS) {
    const target = careerPath(config, relativePath);
    try {
      const watcher = fs.watch(target, { recursive: false }, (_eventType, filename) => {
        const changed = filename ? path.join(relativePath, filename.toString()) : relativePath;
        emitSystemEvent({ type: "change", path: changed, at: new Date().toISOString() });
      });
      watchers.push(watcher);
    } catch {
      // Missing user-layer files are expected before setup is complete.
    }
  }
  emitSystemEvent({ type: "watcher-ready", path: root, at: new Date().toISOString() });
}

export function subscribeSystemEvents(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  res.write(": connected\n\n");
  subscribers.add(res);
  res.on("close", () => subscribers.delete(res));
}

export function emitSystemEvent(event) {
  for (const res of subscribers) {
    res.write(`event: ${event.type || "message"}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}
