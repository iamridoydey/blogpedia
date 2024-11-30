/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import CommentModel from "@/models/comment";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, postId } = body;

    if (!content || !postId) {
      return NextResponse.json(
        { message: "Content and Post ID are required" },
        { status: 400 }
      );
    }

    const newComment = new CommentModel({
      content,
      commentBy: session.user.id, // Use appropriate ID field
      postId,
    });

    const comment = await newComment.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error creating comment: ${error.message}` },
      { status: 500 }
    );
  }
}
