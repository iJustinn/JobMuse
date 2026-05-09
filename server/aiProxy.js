import { readServerConfig } from "./config.js";
import { createServer } from "./index.js";

export function createAiProxyPlugin(env = {}) {
  return {
    name: "jobmuse-ai-proxy",
    configureServer(server) {
      server.middlewares.use(createServer(readServerConfig(env)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createServer(readServerConfig(env)));
    },
  };
}
