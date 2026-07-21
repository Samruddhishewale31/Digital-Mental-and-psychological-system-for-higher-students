import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
  Send,
  Bot,
  User,
  HeartHandshake,
  Mic,
  MicOff,
} from "lucide-react";
import { getEmpatheticReply, type ChatHistoryItem } from "@/lib/chatbot";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

const starterMessage =
  "Hey, I’m really glad you’re here. You can talk to me honestly, like you would with someone who truly wants to listen. What’s been weighing on your heart lately?";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: starterMessage },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const buildHistory = (): ChatHistoryItem[] => {
    return messages
      .filter((msg) => msg.id !== 0)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text,
      }));
  };

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || typing) return;

    const cleanText = text.trim();

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: cleanText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = await getEmpatheticReply(cleanText, buildHistory());

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error while contacting Gemini";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const startListening = (): void => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };

    recognition.onerror = () => {
      alert("Voice input failed. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl flex flex-col h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Mindful Chat
            </h1>

            <p className="text-muted-foreground text-sm">
              Warm emotional support for students with text and voice input.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-muted/60 rounded-xl px-4 py-3 mt-4 leading-relaxed">
          This is emotional support, not medical care. If someone is in
          immediate danger, call <strong>112</strong>. For free mental health
          support in India, call <strong> Tele-MANAS 14416</strong>.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[82%] px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md"
                  : "bg-muted text-foreground rounded-2xl rounded-tl-md"
              }`}
            >
              {msg.text}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>

            <div className="bg-muted px-5 py-3 rounded-2xl rounded-tl-md text-sm">
              Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {listening && (
        <p className="mb-3 text-sm text-primary font-medium">
          Listening... speak now.
        </p>
      )}

      <div className="flex gap-3 items-end">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type or speak how you're feeling..."
          className="flex-1 px-5 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm placeholder:text-muted-foreground"
        />

        <button
          type="button"
          onClick={startListening}
          disabled={typing || listening}
          className={`rounded-2xl h-12 w-12 flex items-center justify-center ${
            listening
              ? "bg-red-500 text-white"
              : "bg-muted text-foreground hover:bg-primary/10"
          } disabled:opacity-50`}
          title="Speak"
        >
          {listening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => void sendMessage(input)}
          disabled={!input.trim() || typing}
          className="rounded-2xl h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;