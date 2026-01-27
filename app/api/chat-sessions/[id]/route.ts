import dbConnect from "@/lib/db";
import ChatSession from "@/models/ChatSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const session = await ChatSession.findById(id);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { messages } = await req.json();
    await dbConnect();
    const session = await ChatSession.findByIdAndUpdate(
      id,
      {
        messages,
        lastMessage: messages[messages.length - 1]?.content || "",
      },
      { new: true },
    );
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const session = await ChatSession.findByIdAndDelete(id);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
