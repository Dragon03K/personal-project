import Business from "@/models/Business";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        {
          error: "Missing business ID",
        },
        {
          status: 400,
        },
      );
    }
    const business = await Business.findById(id);
    if (!business) {
      return NextResponse.json(
        {
          error: "Business not found",
        },
        {
          status: 404,
        },
      );
    }
    await business.deleteOne();
    return NextResponse.json(
      {
        message: "Business deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
