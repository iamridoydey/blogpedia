/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogPostModel from "@/models/blogPost";
import { NextRequest, NextResponse } from "next/server";

// GET: Retrieve a single blog post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    const blogPost = await BlogPostModel.findById(id);

    if (!blogPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error retrieving blog post: ${err.message}` },
      { status: 500 }
    );
  }
}

/// PATCH method to update a post by its ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updateQuery: Record<string, any> = {};
    const pushQuery: Record<string, any> = {};

    // Handle title
    if (body.title) {
      updateQuery.title = body.title;
    }

    // Handle content
    if (body.content) {
      updateQuery.content = body.content;
    }

    // Handle thumbnail (optional)
    if (body.thumbnail) {
      updateQuery.thumbnail = body.thumbnail;
    }

    // Handle tags (optional)
    if (body.tags) {
      updateQuery.tags = Array.isArray(body.tags)
        ? body.tags
        : body.tags.split(" ");
    }

    // Handle editedAt (to update when the post is edited)
    updateQuery.editedAt = Date.now();

    // Check if the blog post exists
    const post = await BlogPostModel.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Update the post in the database
    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      id,
      { $set: updateQuery, ...pushQuery },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Post update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error updating post: ${err.message}` },
      { status: 500 }
    );
  }
}


// DELETE: Delete a single blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    const deletedBlogPost = await BlogPostModel.findByIdAndDelete(id);

    if (!deletedBlogPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error deleting blog post: ${err.message}` },
      { status: 500 }
    );
  }
}
