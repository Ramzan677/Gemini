export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: false, error: "text is required" });
  }

  try {
    const apiRes = await fetch(
      `http://de3.bot-hosting.net:21007/kilwa-chat?text=${encodeURIComponent(text)}`
    );

    const data = await apiRes.json();

    // Unicode safe decode (handles both encoded + normal)
    function decodeUnicode(str) {
      if (!str) return "";
      try {
        return JSON.parse('"' + str.replace(/"/g, '\\"') + '"');
      } catch {
        return str;
      }
    }

    const reply = decodeUnicode(data.reply);

    return res.status(200).json({
      status: true,
      model: data.model || "unknown",
      reply: reply,
      owner: data.owner || null
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: "Failed to fetch API"
    });
  }
}
