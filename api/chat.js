export default async function handler(req, res) {
  // ✅ CORS (important for frontend)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "text is required"
    });
  }

  try {
    // ✅ Timeout controller (avoid hanging)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const apiRes = await fetch(
      `http://de3.bot-hosting.net:21007/kilwa-chat?text=${encodeURIComponent(text)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!apiRes.ok) {
      return res.status(500).json({
        status: false,
        error: "External API error"
      });
    }

    const data = await apiRes.json();

    // ✅ Safe Unicode decode
    function decodeUnicode(str) {
      if (!str || typeof str !== "string") return "";
      try {
        return JSON.parse(
          '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"'
        );
      } catch {
        return str;
      }
    }

    const reply = decodeUnicode(data?.reply) || "No reply received";

    return res.status(200).json({
      status: true,
      model: data?.model || "unknown",
      reply: reply,
      owner: data?.owner || null
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      error: err.name === "AbortError"
        ? "Request timeout"
        : "Failed to fetch API"
    });
  }
}
