import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey123",
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email }).select(
      "+password +approved +admin",
    );
    const isApproved = user ? user.approved === true : false;

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if user is approved
    if (!isApproved) {
      return NextResponse.json(
        { message: "Your account is pending approval by an admin." },
        { status: 403 },
      );
    }

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      admin: !!user.admin,
      approved: !!user.approved,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json(
      {
        message: "Logged in successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          admin: user.admin,
          approved: user.approved,
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
