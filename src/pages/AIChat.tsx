
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Send,
  Bot,
  User,
  HeartHandshake,
  Mic,
  MicOff,
  ArrowLeft,
  Home,
} from "lucide-react";

import {
  getEmpatheticReply,
  type ChatHistoryItem,
} from "@/lib/chatbot";

import { Button } from "@/components/ui/button";

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
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: starterMessage },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef<Message[]>(messages);
  const typingRef = useRef(false);

  // Keep the latest messages available to async functions.
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Keep typing state available to event handlers.
  useEffect(() => {
    typingRef.current = typing;
  }, [typing]);

  // Automatically scroll to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing]);

  // Stop voice recognition when leaving the page.
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;

        try {
          recognitionRef.current.stop();
        } catch {
          // Recognition may already have stopped.
        }

        recognitionRef.current = null;
      }
    };
  }, []);

  // Prepare conversation history for the chatbot.
  const buildHistory = (
    conversation: Message[]
  ): ChatHistoryItem[] => {
    return conversation
      .filter((msg) => msg.id !== 0)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text,
      }));
  };

  // Send a message and receive an AI response.
  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || typingRef.current) return;

    const cleanText = text.trim();

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: cleanText,
    };

    // Capture conversation before adding the current message.
    const previousHistory = buildHistory(messagesRef.current);

    const updatedMessages = [
      ...messagesRef.current,
      userMsg,
    ];

    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);

    setInput("");
    setTyping(true);
    typingRef.current = true;

    try {
      const reply = await getEmpatheticReply(
        cleanText,
        previousHistory
      );

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: reply,
      };

      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        messagesRef.current = updated;
        return updated;
      });
    } catch (error) {
      console.error("Chatbot error:", error);

      const fallbackMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. Remember, you can also reach out to someone you trust for support.",
      };

      setMessages((prev) => {
        const updated = [...prev, fallbackMessage];
        messagesRef.current = updated;
        return updated;
      });
    } finally {
      setTyping(false);
      typingRef.current = false;
    }
  };

  // Start voice recognition.
  const startListening = (): void => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (recognitionRef.current || typingRef.current) return;

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const spokenText = event.results?.[0]?.[0]?.transcript;

      if (spokenText) {
        setInput(spokenText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Voice recognition error:", event.error);

      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      console.error("Unable to start voice recognition:", error);
      setListening(false);
      recognitionRef.current = null;

      alert("Unable to start voice input. Please try again.");
    }
  };

  // Stop voice recognition.
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setInput(e.target.value);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6 sm:py-8">

        {/* NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() =>
              navigate("/assessment", {
                state: { fromAssessment: true },
              })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>

          <Button onClick={() => navigate("/home")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
              <HeartHandshake className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-bold leading-tight">
                Mindful Chat
              </h1>

              <p className="text-sm text-muted-foreground">
                Warm emotional support for students with text and voice input.
              </p>
            </div>
          </div>

          {/* SUPPORT DISCLAIMER */}
          <p className="mt-4 rounded-xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            This is emotional support, not medical care or a substitute
            for professional help. If someone is in immediate danger,
            call <strong>112</strong>. For free mental health support
            in India, call <strong>Tele-MANAS 14416</strong>.
          </p>
        </div>

        {/* CHAT MESSAGES */}
        <div
          className="mb-4 min-h-[300px] flex-1 space-y-4 overflow-y-auto rounded-2xl border bg-card p-4 sm:p-5"
          aria-live="polite"
          aria-label="Chat conversation"
        >
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
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "rounded-tr-md bg-primary text-primary-foreground"
                    : "rounded-tl-md bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>

              {msg.role === "user" && (
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>

              <div className="rounded-2xl rounded-tl-md bg-muted px-5 py-3 text-sm">
                Typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* VOICE STATUS */}
        {listening && (
          <p className="mb-3 text-sm font-medium text-primary">
            Listening... speak now.
          </p>
        )}

        {/* MESSAGE INPUT */}
        <div className="flex items-end gap-3">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type or speak how you're feeling..."
            aria-label="Type your message"
            className="min-w-0 flex-1 rounded-2xl border border-border bg-card px-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            disabled={typing}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            title={listening ? "Stop listening" : "Speak"}
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
              listening
                ? "bg-red-500 text-white"
                : "bg-muted text-foreground hover:bg-primary/10"
            } disabled:opacity-50`}
          >
            {listening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || typing}
            aria-label="Send message"
            title="Send message"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Take your time. You can share only what feels comfortable.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
