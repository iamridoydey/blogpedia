/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogCommentModel from "@/models/blogComment";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { content } = await req.json();

    // Validate the content
    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    // Check if the comment exists
    const hasComment = await BlogCommentModel.findById(id);
    if (!hasComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // Update the comment
    const updatedComment = await BlogCommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    return NextResponse.json(
      { message: "Comment updated successfully", comment: updatedComment },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error updating comment: ${err.message}` },
      { status: 500 }
    );
  }
}
