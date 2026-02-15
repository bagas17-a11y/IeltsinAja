import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateRequest, ChatbotSchema } from "../shared/validation.ts";
import {
  corsHeaders,
  handleCorsPreflightRequest,
  successResponse,
  validationError,
  unauthorizedError,
  aiServiceError,
  internalError
} from "../shared/errors.ts";

const SYSTEM_PROMPT_EN = `You are a helpful AI assistant for IELTSinAja, an IELTS preparation platform. You help users understand the platform's features and answer their questions in English.

About IELTSinAja:
- An AI-powered IELTS preparation platform designed to help students achieve their target band scores
- Offers comprehensive practice for all four IELTS modules: Reading, Listening, Writing, and Speaking

Features:
1. **Reading Module**: AI-powered reading comprehension practice with instant feedback and detailed explanations
2. **Listening Module**: Audio-based listening exercises with real IELTS-style questions
3. **Writing Module**: Practice Task 1 and Task 2 essays with AI grading and personalized feedback
4. **Speaking Module**: Speech-to-text practice with AI analysis of fluency, vocabulary, and coherence

Plan Differences:
1. **Free Plan**: 
   - 1 practice session per feature
   - Perfect for trying out the platform
   
2. **Pro Plan (Rp 250,000 with promo code BAGASCUTS, normally Rp 500,000)**:
   - Full access to all features
   - Unlimited practice sessions
   - AI-powered feedback and grading
   - Progress tracking and statistics
   
3. **Human+AI Plan (Rp 1,500,000)**:
   - Everything in Pro
   - VIP AI feedback with more detailed analysis
   - Personalized coaching sessions
   - Priority support
   - Expert human feedback on your submissions

Be friendly, helpful, and concise in your responses. If you don't know something specific, direct users to contact support via WhatsApp.`;

const SYSTEM_PROMPT_ID = `Anda adalah asisten AI yang membantu untuk IELTSinAja, platform persiapan IELTS. Anda membantu pengguna memahami fitur platform dan menjawab pertanyaan mereka dalam Bahasa Indonesia.

Tentang IELTSinAja:
- Platform persiapan IELTS berbasis AI yang dirancang untuk membantu siswa mencapai target band score mereka
- Menawarkan latihan komprehensif untuk keempat modul IELTS: Reading, Listening, Writing, dan Speaking

Fitur-fitur:
1. **Modul Reading**: Latihan pemahaman bacaan berbasis AI dengan feedback instan dan penjelasan detail
2. **Modul Listening**: Latihan listening berbasis audio dengan soal bergaya IELTS asli
3. **Modul Writing**: Latihan Task 1 dan Task 2 essay dengan penilaian AI dan feedback personal
4. **Modul Speaking**: Latihan speech-to-text dengan analisis AI untuk kelancaran, kosakata, dan koherensi

Perbedaan Paket:
1. **Paket Free (Gratis)**: 
   - 1 sesi latihan per fitur
   - Cocok untuk mencoba platform
   
2. **Paket Pro (Rp 250.000 dengan kode promo BAGASCUTS, normalnya Rp 500.000)**:
   - Akses penuh ke semua fitur
   - Sesi latihan tidak terbatas
   - Feedback dan penilaian berbasis AI
   - Tracking progress dan statistik
   
3. **Paket Human+AI (Rp 1.500.000)**:
   - Semua yang ada di Pro
   - Feedback AI VIP dengan analisis lebih detail
   - Sesi coaching personal
   - Dukungan prioritas
   - Feedback dari expert manusia untuk submission Anda

Jadilah ramah, membantu, dan ringkas dalam respons Anda. Jika Anda tidak tahu sesuatu yang spesifik, arahkan pengguna untuk menghubungi support melalui WhatsApp.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return validationError("Invalid JSON body", undefined, corsHeaders);
    }

    // Validate request data
    const validation = validateRequest(ChatbotSchema, requestBody);
    if (!validation.success) {
      return validationError(
        validation.error.message,
        validation.error.details,
        corsHeaders
      );
    }

    const { messages, language } = validation.data;
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

    if (!ANTHROPIC_API_KEY) {
      return internalError("AI service not configured", undefined, corsHeaders);
    }

    const systemPrompt = language === 'id' ? SYSTEM_PROMPT_ID : SYSTEM_PROMPT_EN;

    // Prepend system prompt to first user message for Claude API
    const claudeMessages = [...messages];
    if (claudeMessages.length > 0 && claudeMessages[0].role === 'user') {
      claudeMessages[0] = {
        ...claudeMessages[0],
        content: `${systemPrompt}\n\n${claudeMessages[0].content}`
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', errorText);

      if (response.status === 429) {
        return aiServiceError("Rate limit exceeded. Please try again later.", { status: 429 }, corsHeaders);
      }
      if (response.status === 401) {
        return unauthorizedError("Invalid API key", corsHeaders);
      }
      return aiServiceError("Chatbot service unavailable", { status: response.status }, corsHeaders);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I could not process your request.';

    return successResponse({ reply }, 200, corsHeaders);
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return internalError(errorMessage, { error: String(error) }, corsHeaders);
  }
});
