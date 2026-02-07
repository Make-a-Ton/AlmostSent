const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = __dirname;

const parseEnv = () => {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
};

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/env.json") {
    const env = parseEnv();
    const payload = {
      SUPABASE_URL: env.SUPABASE_URL || "",
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || "",
    };
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
    return;
  }

  if (url === "/env.js" || url === "/api/env.js") {
    const env = parseEnv();
    const payload = {
      SUPABASE_URL: env.SUPABASE_URL || "",
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || "",
    };
    res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
    res.end(`window.__ENV = ${JSON.stringify(payload)};`);
    return;
  }

  const safePath = url === "/" ? "/index.html" : url;
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
