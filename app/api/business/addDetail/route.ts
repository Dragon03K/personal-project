import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, contact, address } = body;

    await dbConnect();

    if (!name || !category || !contact || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (contact.length !== 10) {
      return NextResponse.json(
        { error: "Contact Number must be 10 digits" },
        { status: 400 },
      );
    }

    const business = await Business.create({
      name,
      category,
      contact,
      address,
    });
    return NextResponse.json(
      { success: true, data: business },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
