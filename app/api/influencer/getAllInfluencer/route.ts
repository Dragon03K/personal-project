import dbConnect from "@/lib/db";
import Influencer from "@/models/Influencer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const influencer = await Influencer.find();
    return NextResponse.json(influencer, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
