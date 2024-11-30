/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import PostModel from "@/models/post";



// GET method to fetch a post by its ID
export async function GET(req: NextRequest, {params}: any) {
  const { id } = params; // Extract the id from params

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  let post = null;
  try {
    post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { message: `Error fetching post: ${err}` },
      { status: 500 }
    );
  }

  return NextResponse.json(post, { status: 200 });
}

// PATCH method to update a post by its ID
export async function PATCH(req: NextRequest, {params}:any) {
  const { id } = params; // Extract the id from params
  const body = await req.json();

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  let post = null;
  try {
    post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { message: `Error fetching post: ${err}` },
      { status: 500 }
    );
  }

  try {
    const updateQuery: Record<string, any> = {};

    for (const key in body) {
      if (body[key] !== undefined) {
        updateQuery[key] = body[key];
      }
    }

    if (Object.keys(updateQuery).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        ...updateQuery,
        editedAt: Date.now(),
      },
      { new: true }
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error updating post: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE method to delete a post by its ID
export async function DELETE(req: NextRequest, {params}: any) {
  const { id } = params; // Extract the id from params

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  try {
    const post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await PostModel.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Successfully deleted the post" },
      { status: 204 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error deleting post: ${error.message}` },
      { status: 500 }
    );
  }
}
