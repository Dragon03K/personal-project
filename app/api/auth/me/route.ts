import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey123",
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;

    await dbConnect();

    // Fetch user details from database
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Filter out password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Unauthorized: " + error.message },
      { status: 401 },
    );
  }
}
