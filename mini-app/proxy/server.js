const http = require("http");
const { URL } = require("url");

// 🔐 Токен 
const API_TOKEN = [HIDDEN FOR SECURITY REASONS];
const API_BASE = "https://shard.ru/external/api";

const server = http.createServer(async (req, res) => {
  try {
    // Разрешаем CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Обработка preflight-запросов (CORS)
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    // Парсим URL
    const url = new URL(req.url, "http://localhost");
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts[0] === "address" && pathParts.length === 3) {
      const identifier = pathParts[1];
      const currencyTag = pathParts[2];

      const targetUrl = `${API_BASE}/address/${encodeURIComponent(
        identifier
      )}/risks/${currencyTag}?token=${API_TOKEN}`;

      const response = await fetch(targetUrl);
      const data = await response.text();

      res.writeHead(response.status, {
        "Content-Type": "application/json",
      });
      return res.end(data);
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

const PORT = 3001;

server.listen(PORT, "127.0.0.1", () => {
  console.log(`✅ Прокси-сервер запущен на http://localhost:${PORT}`);
  console.log(`👉 Запусти: tuna http ${PORT}`);
});
