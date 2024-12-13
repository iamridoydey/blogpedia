/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogPostModel from "@/models/blogPost";
import TagModel from "@/models/tags";
import { NextRequest, NextResponse } from "next/server";

// GET: Retrieve a single blog post
export async function GET(
  req: NextRequest,
  context: any 
) {
  try {
    await dbConnect();

    const { id } = context.params;

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

// PATCH: Update a blog post
export async function PATCH(
  req: NextRequest,
  context:any
) {
  try {
    await dbConnect();
    const { id } = context.params;
    const body = await req.json();

    const updateQuery: Record<string, any> = {};

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

    // Normalize tags
    const newTags = Array.isArray(body.tags)
      ? body.tags.map((tag: string) => tag.trim().toLowerCase())
      : body.tags?.split(" ").map((tag: string) => tag.trim().toLowerCase());

    // Find the existing post to manage tag usage
    const post = await BlogPostModel.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Update tags if provided
    if (newTags) {
      const oldTags = post.tags;

      // Decrement usage for removed tags
      const removedTags = oldTags.filter((tag) => !newTags.includes(tag));
      for (const tag of removedTags) {
        await TagModel.decrementUsage(tag);
      }

      // Increment usage for new tags
      const addedTags = newTags.filter((tag: string) => !oldTags.includes(tag));
      for (const tag of addedTags) {
        const existingTag = await TagModel.findOne({ name: tag });
        if (existingTag) {
          await TagModel.incrementUsage(tag);
        } else {
          await TagModel.create({ name: tag, usageCount: 1 });
        }
      }

      updateQuery.tags = newTags;
    }

    // Update the blog post
    updateQuery.editedAt = Date.now();
    const updatedPost = await BlogPostModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

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

// DELETE: Delete a blog post
export async function DELETE(
  req: NextRequest,
  context:any
) {
  try {
    await dbConnect();

    const { id } = context.params;

    // Find the post to get its tags
    const post = await BlogPostModel.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Decrement usage for all tags associated with the post
    for (const tag of post.tags) {
      await TagModel.decrementUsage(tag);
    }

    // Delete the blog post
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
