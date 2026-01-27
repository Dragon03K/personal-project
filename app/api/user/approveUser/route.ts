import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey123",
);

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Verify token to get current user
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const requesterId = String(payload.userId);
    const isRequesterAdmin = payload.admin as boolean;

    // Check if requester is admin
    if (!isRequesterAdmin) {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can approve users" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { userId, approved, admin } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update approved status if provided
    if (approved !== undefined) {
      user.approved = approved;
    }

    // Update admin status if provided (prevent self-update)
    if (admin !== undefined) {
      if (requesterId === userId) {
        return NextResponse.json(
          { message: "You cannot update your own admin rights" },
          { status: 400 },
        );
      }
      user.admin = admin;
    }

    await user.save();

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Approve User Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
