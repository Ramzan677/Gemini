export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: false, error: "text required" });
  }

  try {
    // 🔹 Step 1: create session (safe)
    await fetch(
      "https://flipy-flip.vercel.app/session/create?session=john123&ai_name=Assistant&looklike=smart+girl&core_prompt=You+are+a+helpful+AI&my_name=User&password=123"
    );

    // 🔹 Step 2: chat
    const apiRes = await fetch(
      `https://flipy-flip.vercel.app/chat?message=${encodeURIComponent(text)}&session=john123`
    );

    const data = await apiRes.json();

    return res.status(200).json({
      status: true,
      reply: data.reply || "No reply"
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "API failed"
    });
  }
}
