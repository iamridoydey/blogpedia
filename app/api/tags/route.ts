/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import TagModel from "@/models/tags";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    const tags = await TagModel.find({})
      // Sort by usage in descending order
      .sort({ usage: -1 })
      .lean();

    if (!tags.length) {
      return NextResponse.json({ message: "No tags found" }, { status: 404 });
    }

    return NextResponse.json(tags, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error fetching tags: ${error.message}` },
      { status: 500 }
    );
  }
}
