import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const business = await Business.find();
    return NextResponse.json({ business }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
