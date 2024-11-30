/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import CommentModel from "@/models/comment";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  {params}: any
) {
  const { id } = params;

  if (!id || !Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  try {
    const comments = await CommentModel.find({
      postId: new Types.ObjectId(id),
    });

    if (!comments.length) {
      return NextResponse.json(
        { message: "No comments found for this post" },
        { status: 404 }
      );
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error fetching comments: ${error.message}` },
      { status: 500 }
    );
  }
}
