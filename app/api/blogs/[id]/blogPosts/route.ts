/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogPostModel from "@/models/blogPost";
import { NextRequest, NextResponse } from "next/server";

// Adding correct types for params
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate the 'id' parameter
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing BlogPost ID" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Fetch all blog posts by blogId
    const blogPosts = await BlogPostModel.find({ blogId: id });

    // If no posts are found, return a 404 error
    if (!blogPosts.length) {
      return NextResponse.json(
        { message: "No posts found for this blog" },
        { status: 404 }
      );
    }

    // Return the found blog posts
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error getting blog posts: ${error.message}` },
      { status: 500 }
    );
  }
}

// For unsupported POST method, return 405
export async function POST() {
  return NextResponse.json(
    { message: "Method POST not allowed" },
    { status: 405 }
  );
}
