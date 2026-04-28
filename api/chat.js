export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { text } = req.query;
  const session = "test123";

  if (!text) {
    return res.status(400).json({ status: false });
  }

  try {
    // ❗ session create only once (optional)
    await fetch(
      `https://fl ipy-flip.vercel.app/session/create?session=${session}&ai_name=test&looklike=girl&core_prompt=You+are+a+helpful+AI&my_name=user&password=1234`
    );

    const apiRes = await fetch(
      `https://fl ipy-flip.vercel.app/chat?message=${encodeURIComponent(text)}&session=${session}`
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
