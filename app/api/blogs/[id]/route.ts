/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import BlogModel from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();

    // Validate ID format
    if (!id) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Fetch the blog by ID
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error fetching blog: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updateQuery: any = {};
    const pushQuery: any = {};
    const pullQuery: any = {};

    // Handle domain
    if (body.domain) {
      const isDomainExist = await BlogModel.findOne({ domain: body.domain });
      if (isDomainExist && isDomainExist._id.toString() !== id) {
        return NextResponse.json(
          { message: "Domain Already Exists" },
          { status: 400 }
        );
      }
      updateQuery.domain = body.domain;
    }

    // Handle bloglogo and blogCoverPic
    if (body.bloglogo) {
      updateQuery.bloglogo = body.bloglogo;
    }

    if (body.blogCoverPic) {
      updateQuery.blogCoverPic = body.blogCoverPic;
    }

    // Handle followedBy
    if (body.followedBy) {
      if (body.followedBy.add) {
        if (!pushQuery.$push) pushQuery.$push = {};
        pushQuery.$push.followedBy = body.followedBy.add;
      } else if (body.followedBy.remove) {
        if (!pullQuery.$pull) pullQuery.$pull = {};
        pullQuery.$pull.followedBy = body.followedBy.remove;
      }
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        $set: updateQuery,
        ...pushQuery,
        ...pullQuery,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { message: "Blog not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog updated successfully", blog: updatedBlog },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error updating blog: ${err.message}` },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;

  try {
    await dbConnect();
    // Delete the blog by ID
    const deletedBlog = await BlogModel.findByIdAndDelete(id);

    // If no user is found and deleted, return a 404 status
    if (!deletedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "successfully Deleted The Blog" },
      { status: 200 }
    );

  } catch (error: any) {
    // Catch any error and return a 500 status with an error message
    return NextResponse.json(
      { message: `Error deleting user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
