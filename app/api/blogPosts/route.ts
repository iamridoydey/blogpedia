/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import BlogModel from "@/models/blog";
import BlogPostModel from "@/models/blogPost";
import TagModel from "@/models/tags";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

await dbConnect();

export async function POST(req: NextRequest) {
  try {
    // Extracting data from request body
    const { blogId, title, thumbnail, content, tags } = await req.json();

    // Get session
    const session = await getServerSession(authOptions);

    // Validate content
    if (!content) {
      return NextResponse.json(
        { message: `Provide content for the blog post` },
        { status: 400 }
      );
    }

    // Validate title
    if (!title) {
      return NextResponse.json(
        { message: `Provide title for the blog post` },
        { status: 400 }
      );
    }

    // Validate blog existence
    const isBlogExist = await BlogModel.findById(blogId);
    if (!isBlogExist) {
      return NextResponse.json(
        { message: `Blog doesn't exist` },
        { status: 400 }
      );
    }

    // Normalize and process tags
    const tagArray = Array.isArray(tags) ? tags : tags.split(" ");
    const normalizedTags = tagArray.map((tag: string) =>
      tag.trim().toLowerCase()
    );

    // Increment usage count for each tag
    for (const tagName of normalizedTags) {
      const tag = await TagModel.findOne({ name: tagName });
      if (tag) {
        await TagModel.incrementUsage(tagName); // Increment usage if tag exists
      } else {
        await TagModel.create({ name: tagName, usageCount: 1 }); // Create a new tag if it doesn't exist
      }
    }

    // Create a blog post
    const blogPost = await BlogPostModel.create({
      title,
      thumbnail: thumbnail || "",
      content,
      tags: normalizedTags,
      blogId,
      userId: session?.user.id,
    });

    // Return the created blog post
    return NextResponse.json(blogPost, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error creating blog post: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogPosts = await BlogPostModel.find({});
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error finding blog post: ${err.message}` },
      { status: 500 }
    );
  }
}
