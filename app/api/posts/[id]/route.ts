/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import PostModel from "@/models/post";
import dbConnect from "@/lib/db";
import TagModel from "@/models/tags";

// GET method to fetch a post by its ID
export async function GET(req: NextRequest, context: any) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  let post = null;
  try {
    dbConnect();
    post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error fetching post: ${err.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(post, { status: 200 });
}

// PATCH method to update a post by its ID
export async function PATCH(req: NextRequest, context:any) {
  try {
    await dbConnect();
    const { id } = context.params;
    const body = await req.json();

    const updateQuery: Record<string, any> = {};

    // Check if post exists
    const post = await PostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Handle title
    if (body.title) {
      updateQuery.title = body.title;
    }

    // Handle content
    if (body.content) {
      updateQuery.content = body.content;
    }

    // Handle thumbnail
    if (body.thumbnail) {
      updateQuery.thumbnail = body.thumbnail;
    }

    // Handle tags
    if (body.tags) {
      const newTags = Array.isArray(body.tags)
        ? body.tags
        : body.tags.split(" ");
      const oldTags = post.tags;

      // Increment usage for new tags
      const tagsToAdd = newTags.filter((tag: string) => !oldTags.includes(tag));
      const tagsToRemove = oldTags.filter((tag) => !newTags.includes(tag));

      for (const tag of tagsToAdd) {
        await TagModel.incrementUsage(tag);
      }

      // Decrement usage for removed tags
      for (const tag of tagsToRemove) {
        await TagModel.decrementUsage(tag);
      }

      updateQuery.tags = newTags;
    }

    // Handle editedAt (to update when the post is edited)
    updateQuery.editedAt = Date.now();

    // Update the post in the database
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateQuery },
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

// DELETE method to delete a post by its ID
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing post ID" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const post = await PostModel.findById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Decrement usage for all tags associated with the post
    for (const tag of post.tags) {
      await TagModel.decrementUsage(tag);
    }

    // Delete the post
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