/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogModel from "@/models/blog";
import UserModel from "@/models/user";
import { PipelineStage } from "mongoose";
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

export async function GET(req: any) {
  try {
    await dbConnect();

    // Get the limit from query parameters
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limit = parseInt(limitParam ?? '0', 10);

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $sort: { createdAt: -1 } } as PipelineStage, 
    ];

    // Add limit stage if limit is provided and greater than 0
    if (limit > 0) {
      pipeline.push({ $limit: limit } as PipelineStage);
    }

    const blogs = await BlogModel.aggregate(pipeline);

    if (!blogs.length) {
      return NextResponse.json({ message: "No blogs found" }, { status: 404 });
    }

    return NextResponse.json(blogs, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching blogs: ", err);
    return NextResponse.json(
      { message: `Error fetching blogs: ${err.message}` },
      { status: 500 }
    );
  }
}

