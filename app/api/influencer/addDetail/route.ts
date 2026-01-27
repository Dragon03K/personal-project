import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, category, gender, instagramId } = body;

    await dbConnect();

    if (!name || !url || !category || !gender || !instagramId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const influencer = await Influencer.create({
      name,
      url,
      category,
      gender,
      instagramId,
    });

    return NextResponse.json(
      { message: "Influencer added successfully", influencer },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
