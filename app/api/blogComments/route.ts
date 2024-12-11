/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import BlogCommentModel from "@/models/blogComment";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, blogPostId } = body;

    if (!content && !blogPostId) {
      return NextResponse.json(
        { message: "Can't comment here" },
        { status: 400 }
      );
    }

    await dbConnect();
    const newBlogComment = new BlogCommentModel({
      content,
      commentedBy: session.user.id,
      blogPostId,
    });

    const comment = await newBlogComment.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error creating comment: ${error.message}` },
      { status: 500 }
    );
  }
}
