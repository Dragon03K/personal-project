import Influencer from "@/models/Influencer";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Invalid influencer ID" },
        { status: 400 },
      );
    }
    await Influencer.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Influencer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
