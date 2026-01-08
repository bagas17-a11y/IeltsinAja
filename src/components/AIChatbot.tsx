import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "id" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLanguageSelect = (lang: "en" | "id") => {
    setLanguage(lang);
    const welcomeMessage = lang === "en" 
      ? "Hello! 👋 I'm your IELTSinAja assistant. How can I help you today? Feel free to ask about our features, pricing plans, or anything else!"
      : "Halo! 👋 Saya asisten IELTSinAja Anda. Ada yang bisa saya bantu hari ini? Silakan tanyakan tentang fitur, paket harga, atau hal lainnya!";
    
    setMessages([{ role: "assistant", content: welcomeMessage }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !language) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chatbot", {
        body: { 
          messages: [...messages, { role: "user", content: userMessage }],
          language 
        },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = language === "en" 
        ? "Sorry, I encountered an error. Please try again or contact us via WhatsApp."
        : "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.";
      setMessages(prev => [...prev, { role: "assistant", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setLanguage(null);
    setMessages([]);
    setInput("");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#ADD8E6] hover:bg-[#87CEEB] text-primary-foreground shadow-lg flex items-center justify-center z-[9999] transition-all hover:scale-110 ${isOpen ? 'hidden' : ''}`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 text-slate-700" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#ADD8E6] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-slate-700" />
              <span className="font-semibold text-slate-700">IELTSinAja Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              {language && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetChat}
                  className="text-slate-700 hover:bg-[#87CEEB] h-8 px-2 text-xs"
                >
                  Reset
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {!language ? (
              /* Language Selection */
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                <MessageCircle className="w-12 h-12 text-[#ADD8E6]" />
                <p className="text-center text-foreground font-medium">
                  Which language would you like to proceed with?
                </p>
                <p className="text-center text-muted-foreground text-sm">
                  Bahasa apa yang ingin Anda gunakan?
                </p>
                <div className="flex gap-3 mt-2">
                  <Button
                    onClick={() => handleLanguageSelect("en")}
                    className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-slate-700"
                  >
                    English
                  </Button>
                  <Button
                    onClick={() => handleLanguageSelect("id")}
                    className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-slate-700"
                  >
                    Bahasa Indonesia
                  </Button>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <>
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-[#ADD8E6] text-slate-700"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={language === "en" ? "Type a message..." : "Ketik pesan..."}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-slate-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
