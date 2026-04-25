export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: false, error: "text required" });
  }

  try {
    const session = "john123";

    // 🔹 1. Create session
    await fetch(
      `https://flipy-flip.vercel.app/session/create?session=${session}&ai_name=Assistant&looklike=smart+girl&core_prompt=You+are+a+helpful+AI&my_name=User&password=123`
    );

    // 🔹 2. IMPORTANT DELAY (very important)
    await new Promise(r => setTimeout(r, 1000));

    // 🔹 3. Chat
    const apiRes = await fetch(
      `https://flipy-flip.vercel.app/chat?message=${encodeURIComponent(text)}&session=${session}`
    );

    const data = await apiRes.json();

    console.log("FLIPY RESPONSE:", data);

    // 🔥 FIX: handle different formats
    const reply =
      data.reply ||
      data.message ||
      data.response ||
      (typeof data === "string" ? data : null);

    return res.status(200).json({
      status: true,
      reply: reply || "API did not return valid reply"
    });

  } catch (e) {
    console.error(e);

    return res.status(500).json({
      status: false,
      error: "API failed"
    });
  }
}
