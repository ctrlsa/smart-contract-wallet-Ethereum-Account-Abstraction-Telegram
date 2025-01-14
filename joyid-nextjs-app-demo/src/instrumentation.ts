import type NodeCache from "node-cache";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const NodeCache = (await import("node-cache")).default;
    const config: NodeCache.Options = {
      stdTTL: process.env.NODE_ENV === "production" ? 0 : 60,
    };

    global.cacheConfigs = new NodeCache(config);
    global.cacheUser = new NodeCache(config);
    //other caches

    // Other things that should only happen once at server startup.
    // firebase-admin connect, etc
  }
}
