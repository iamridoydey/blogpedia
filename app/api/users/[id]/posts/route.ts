/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import PostModel from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  const { id } = params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing user ID" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const posts = await PostModel.find({ userId: id });

    if (!posts.length) {
      return NextResponse.json(
        { message: "No posts found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error getting posts: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: "Method POST not allowed" },
    { status: 405 }
  );
}
