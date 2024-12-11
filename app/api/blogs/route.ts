/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogModel from "@/models/blog";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse request body
    const { domain, bloglogo, blogCoverPic, userId } = await req.json();

    // Validate required fields
    if (!domain || !userId) {
      return NextResponse.json(
        { message: "Domain and userId are required" },
        { status: 400 }
      );
    }

    // Check whether the domain already exists
    const isDomainExist = await BlogModel.findOne({ domain });
    if (isDomainExist) {
      return NextResponse.json(
        { message: "Domain already taken" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }

    // Create a new blog
    const newBlog = await BlogModel.create({
      domain,
      bloglogo: bloglogo || "",
      blogCoverPic: blogCoverPic || "",
      userId,
    });

    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error creating blog: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    // Get all the blogs
    const allBlogs = await BlogModel.find({});
    return NextResponse.json({ allBlogs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error fetching blogs: ${err.message}` },
      { status: 500 }
    );
  }
}
