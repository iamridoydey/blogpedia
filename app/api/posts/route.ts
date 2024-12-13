/* eslint-disable @typescript-eslint/no-explicit-any */
import PostModel from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body as JSON
    const { title, content, picture, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create a new post
    const post = new PostModel({
      title,
      content,
      picture,
      tags: Array.isArray(tags) ? tags : tags.split(" "),
      userId: session.user.id,
    });

    // Save the post to the database
    const newPost = await post.save();

    // Return the created post
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error Creating Post: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogPosts = await PostModel.find({});
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error finding posts: ${err.message}` },
      { status: 500 }
    );
  }
}
