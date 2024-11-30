/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import CommentModel from "@/models/comment";

export async function PATCH(
  req: NextRequest,
  params: any 
) {
  const { id } = params;
  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 400 }
    );
  }

  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  params:any
) {
  const { id } = params;

  try {
    const deletedComment = await CommentModel.findByIdAndDelete(id);

    if (!deletedComment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Successfully deleted the comment" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(null, { status: 204 });
}
