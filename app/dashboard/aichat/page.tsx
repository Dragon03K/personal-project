"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { SendIcon, BotIcon, UserIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatContent = () => {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get("id");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(sessionIdParam);
    if (sessionIdParam) {
      const fetchSession = async () => {
        try {
          console.log("Fetching session:", sessionIdParam);
          const res = await fetch(`/api/chat-sessions/${sessionIdParam}`);
          if (!res.ok) throw new Error("Failed to fetch session");
          const data = await res.json();
          console.log("Loaded session data:", data);
          if (data.messages) {
            setMessages(
              data.messages.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })),
            );
          }
        } catch (error) {
          console.error("Failed to load session:", error);
          toast.error("Failed to load chat history");
        }
      };
      fetchSession();
    } else {
      setMessages([]);
      setSessionId(null);
    }
  }, [sessionIdParam]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const saveSession = async (updatedMessages: Message[]) => {
    try {
      const dbMessages = updatedMessages.map(
        ({ role, content, timestamp }) => ({
          role,
          content,
          timestamp,
        }),
      );

      if (!sessionId) {
        // Create new session
        const res = await fetch("/api/chat-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedMessages[0]?.content.slice(0, 30) + "...",
            messages: dbMessages,
          }),
        });
        const data = await res.json();
        if (data._id) {
          setSessionId(data._id);
          // Update URL without refreshing
          window.history.pushState(
            null,
            "",
            `/dashboard/aichat?id=${data._id}`,
          );
        }
      } else {
        // Update existing session
        await fetch(`/api/chat-sessions/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: dbMessages }),
        });
      }
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);

      // Save to database
      await saveSession(finalMessages);
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full mx-auto p-0 gap-0">
      <Card className="flex-1 flex flex-col overflow-hidden border-none rounded-none shadow-none bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <BotIcon className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-semibold text-lg">AI Assistant</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {sessionId ? "Continuining Session" : "Always active"}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="font-mono">
            Gemini
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="flex flex-col gap-4">
            {messages.length === 0 && !isThinking && (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-4 text-muted-foreground">
                <div className="p-4 rounded-full bg-primary/10">
                  <BotIcon className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground">
                    Welcome to AI Chat
                  </h3>
                  <p>Send a message to start the conversation.</p>
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <UserIcon className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <BotIcon className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-2xl p-3 text-sm shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      } whitespace-pre-wrap`}
                    >
                      {message.content}
                      <div
                        className={`text-[10px] mt-1 opacity-50 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 items-center">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <BotIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-medium italic text-muted-foreground">
                      Thinking
                    </span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-background/80 border-t flex gap-2 items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isThinking}
            className="flex-1 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary h-11 px-4 text-base"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isThinking}
            size="icon"
            className="h-11 w-11 shrink-0 transition-transform active:scale-90"
          >
            {isThinking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
          </Button>
        </form>
      </Card>

      <div className="px-4 text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
        <span>AI can make mistakes. Check important info.</span>
      </div>
    </div>
  );
};

const AiChat = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
};

export default AiChat;
