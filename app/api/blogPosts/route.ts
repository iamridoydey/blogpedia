/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import BlogPostModel from "@/models/blogPost";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    // BlogId = id
    const { id, title, thumbnail, content, tags } = await req.json();
    // Get session
    const session = await getServerSession(authOptions);

    if (content == null || content == undefined || content == "") {
      return NextResponse.json(
        { message: `Provide content for the blog post` },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { message: `Provide title for the blog post` },
        { status: 400 }
      );
    }
    // Find the blog using id as blogId
    const isBlogExist = await BlogPostModel.findById(id);

    if (!isBlogExist) {
      return NextResponse.json(
        { message: `Blog doesn't exist` },
        { status: 400 }
      );
    }

    // Create a blog post
    const blogPost = await BlogPostModel.create({
      title,
      thumbnail: thumbnail || "",
      content,
      tags:Array.isArray(tags) ? tags : tags.split(" "),
      blogId: id,
      userId: session?.user.id,
    });

    return NextResponse.json(blogPost, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error creating blog post: ${err.message}` },
      { status: 500 }
    );
  }
}
