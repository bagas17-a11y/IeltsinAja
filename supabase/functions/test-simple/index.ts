// Simple test function to verify edge functions work
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    console.log("Test function called");

    // Test Claude API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ANTHROPIC_API_KEY not set"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    console.log("API key exists, testing Claude API...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 50,
        messages: [{ role: "user", content: "Reply with just 'OK'" }],
      }),
    });

    console.log("Claude API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Claude API failed",
          status: response.status,
          details: errorText.substring(0, 200)
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const data = await response.json();
    console.log("Claude API success!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "All tests passed",
        claudeResponse: data.content?.[0]?.text || "No response",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error: any) {
    console.error("Test function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 3),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
