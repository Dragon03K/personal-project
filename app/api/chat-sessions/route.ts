import dbConnect from "@/lib/db";
import ChatSession from "@/models/ChatSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const sessions = await ChatSession.find().sort({ updatedAt: -1 });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, messages } = await req.json();
    await dbConnect();
    const session = await ChatSession.create({
      title,
      messages,
      lastMessage: messages[messages.length - 1]?.content || "",
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
