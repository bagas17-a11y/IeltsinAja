export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(500).json({ error: "OPENAI_API_KEY not configured" });
    return;
  }

  const { model, input, voice, speed } = req.body ?? {};

  const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: model ?? "tts-1-hd", input, voice, speed }),
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    res.status(upstream.status).send(text);
    return;
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.send(buffer);
}
