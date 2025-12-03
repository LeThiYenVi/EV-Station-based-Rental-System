const http = require("http");
const https = require("https");
const url = require("url");

const PORT = 3001;
const TARGET = "http://localhost:8080";

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Proxy request
  const targetUrl = TARGET + req.url;
  console.log(`[PROXY] ${req.method} ${targetUrl}`);
  console.log(`[HEADERS] Content-Type: ${req.headers["content-type"]}`);

  // Clone headers but let backend handle content-length for multipart
  const proxyHeaders = { ...req.headers };
  delete proxyHeaders["host"]; // Remove host header

  const options = {
    method: req.method,
    headers: proxyHeaders,
  };

  const proxyReq = http.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("[PROXY ERROR]", err);
    res.writeHead(500);
    res.end("Proxy Error");
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to ${TARGET}`);
});
