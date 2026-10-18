import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const manifest = JSON.parse(
  fs.readFileSync("src/app/manifest.webmanifest", "utf8"),
);
const worker = fs.readFileSync("public/sw.js", "utf8");
function harness(fetchImpl) {
  const listeners = {},
    cached = [];
  const cache = { add: async (url) => cached.push(url) };
  const offline = new Response("offline notice");
  const self = {
    addEventListener: (name, cb) => {
      listeners[name] = cb;
    },
    skipWaiting() {},
    clients: { claim: async () => {} },
    location: { origin: "https://www.simuladoup.com.br" },
  };
  vm.runInNewContext(worker, {
    self,
    URL,
    Response,
    fetch: fetchImpl,
    caches: {
      open: async () => cache,
      keys: async () => [],
      match: async () => offline,
    },
  });
  return { listeners, cached, offline };
}
test("PWA launches the canonical study entry and references existing icons", () => {
  assert.equal(manifest.start_url, "/app");
  assert.equal(manifest.display, "standalone");
  for (const icon of manifest.icons)
    assert.ok(fs.existsSync("public" + icon.src));
  const links = JSON.parse(
    fs.readFileSync("public/.well-known/assetlinks.json", "utf8"),
  );
  assert.equal(links[0].target.package_name, "br.com.simuladoup.app");
  assert.match(
    links[0].target.sha256_cert_fingerprints[0],
    /^([A-F0-9]{2}:){31}[A-F0-9]{2}$/,
  );
});
test("offline installation caches only the public connection notice", async () => {
  const h = harness(async () => new Response("network"));
  let done;
  h.listeners.install({
    waitUntil(p) {
      done = p;
    },
  });
  await done;
  assert.deepEqual(h.cached, ["/offline.html"]);
});
test("offline worker never intercepts account APIs, submissions or external navigation", () => {
  const h = harness(async () => new Response("network"));
  for (const request of [
    {
      url: "https://www.simuladoup.com.br/api/auth/get-session",
      method: "GET",
      mode: "cors",
    },
    {
      url: "https://www.simuladoup.com.br/api/users/progress",
      method: "POST",
      mode: "cors",
    },
    { url: "https://outside.example/", method: "GET", mode: "navigate" },
  ])
    h.listeners.fetch({
      request,
      respondWith() {
        assert.fail("Private data must bypass offline cache");
      },
    });
});
test("navigation uses the network and falls back to the notice only when offline", async () => {
  for (const disconnected of [false, true]) {
    const h = harness(async () => {
      if (disconnected) throw Error("offline");
      return new Response("live study page");
    });
    let result;
    h.listeners.fetch({
      request: {
        url: "https://www.simuladoup.com.br/app",
        method: "GET",
        mode: "navigate",
      },
      respondWith(p) {
        result = p;
      },
    });
    assert.equal(
      await (await result).text(),
      disconnected ? "offline notice" : "live study page",
    );
  }
});
