"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BotIcon,
  MessageSquareIcon,
  CalendarIcon,
  ArrowRightIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatSession {
  _id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  messages: any[];
}

const SavedAIChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/chat-sessions");
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this chat session?")) {
      return;
    }

    try {
      const res = await fetch(`/api/chat-sessions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s._id !== id));
        toast.success("Chat deleted successfully");
      } else {
        toast.error("Failed to delete chat");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the chat");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved AI Chats</h1>
          <p className="text-muted-foreground">
            Resume your previous conversations with the AI Assistant.
          </p>
        </div>
        <Link href="/dashboard/aichat">
          <Badge
            variant="secondary"
            className="px-4 py-1 cursor-pointer hover:bg-secondary/80"
          >
            + New Chat
          </Badge>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="gap-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : sessions.length === 0 ? (
          <Card className="col-span-full py-12 flex flex-col items-center justify-center text-center border-dashed">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <MessageSquareIcon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>No saved chats yet</CardTitle>
            <CardDescription className="max-w-xs mt-2">
              Start a new conversation to see your history here.
            </CardDescription>
            <Link href="/dashboard/aichat" className="mt-6">
              <Badge className="px-6 py-2">Start Chatting</Badge>
            </Link>
          </Card>
        ) : (
          sessions.map((session) => (
            <Link
              key={session._id}
              href={`/dashboard/aichat?id=${session._id}`}
            >
              <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full flex flex-col bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BotIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono"
                      >
                        {session.messages.length} msgs
                      </Badge>
                      <button
                        onClick={(e) => handleDelete(e, session._id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Chat"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {session.title || "Untitled Chat"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1 italic">
                    "{session.lastMessage || "No messages yet..."}"
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      {formatDistanceToNow(new Date(session.updatedAt), {
                        addSuffix: true,
                      })}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedAIChat;
