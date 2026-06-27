// Serverless proxy for OpenAI Whisper transcription.
//
// SECURITY: This keeps the OpenAI API key server-side (process.env.OPENAI_API_KEY,
// NOT a VITE_ variable). The browser must never hold the OpenAI key, so the
// frontend posts the recorded audio here and we forward it to OpenAI.
//
// We disable Vercel's default body parser so the raw multipart/form-data stream
// (the audio file) is passed straight through to OpenAI.
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  try {
    // Buffer the incoming multipart body (the audio file + form fields).
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks);

    const upstream = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        // Preserve the multipart boundary from the original request.
        "Content-Type": req.headers["content-type"] ?? "multipart/form-data",
      },
      body,
    });

    if (!upstream.ok) {
      // Log upstream detail server-side; return a generic message to the client.
      const detail = await upstream.text().catch(() => "");
      console.error("Whisper upstream error:", upstream.status, detail);
      res.status(upstream.status).json({ error: "Transcription failed" });
      return;
    }

    const json = await upstream.json();
    res.status(200).json(json);
  } catch (err) {
    console.error("transcribe proxy error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
