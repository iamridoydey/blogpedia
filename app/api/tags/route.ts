/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import TagModel from "@/models/tags";
import { NextResponse } from "next/server";
import { PipelineStage } from "mongoose"; // Import Mongoose's PipelineStage type

export async function GET(req: any) {
  try {
    await dbConnect();

    // Get the limit from query parameters
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = parseInt(limitParam ?? "0", 10);

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $sort: { usage: -1 } } as PipelineStage, // Type assertion for $sort stage
    ];

    // Add limit stage if limit is provided and greater than 0
    if (limit > 0) {
      pipeline.push({ $limit: limit } as PipelineStage); // Type assertion for $limit stage
    }

    const tags = await TagModel.aggregate(pipeline);

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
