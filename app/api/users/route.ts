/* eslint-disable @typescript-eslint/no-explicit-any */
import UserModel from "@/models/user";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { userValidation } from "@/validation/signupValidation";
import { z } from "zod";
import { extractNameFromEmail } from "@/helperFunction/extractNameFromEmail";
import { generateUsername } from "@/helperFunction/generateUsername";
import { PipelineStage } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("user data", email, password);

    // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate using Zod
    try {
      userValidation.parse({ email, password });
      console.log("Validation passed");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: error.errors.map((e) => e.message).join(", ") },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: "An unexpected error occurred!" },
          { status: 500 }
        );
      }
    }

    // Database connection and validation
    await dbConnect();
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique username and name
    const firstname = extractNameFromEmail(email);
    const username = generateUsername(firstname);

    // Save the user
    const newUser = new UserModel({
      firstname,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // It stop the password to be sent to the frontend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (err: any) {
    console.error("Error: ", err.message);
    return NextResponse.json(
      { message: `Error Creating User: ${err.message}` },
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

    // Assume the current user's ID is provided in the query parameter for simplicity
    const currentUserId = url.searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json({ message: "Current user ID not provided" }, { status: 400 });
    }

    // Fetch the current user to get the list of users they are following
    const currentUser = await UserModel.findById(currentUserId).lean();

    if (!currentUser) {
      return NextResponse.json({ message: "Current user not found" }, { status: 404 });
    }

    const followingIds = currentUser.following;

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $match: { _id: { $nin: [...followingIds, currentUserId] } } } as PipelineStage, 
      { $sort: { usage: -1 } } as PipelineStage,
    ];

    // Add limit stage if limit is provided and greater than 0
    if (limit > 0) {
      pipeline.push({ $limit: limit } as PipelineStage);
    }

    console.log("Aggregation Pipeline: ", pipeline); 

    const users = await UserModel.aggregate(pipeline);

    if (!users.length) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users: ", error); 
    return NextResponse.json(
      { message: `Error fetching users: ${error.message}` },
      { status: 500 }
    );
  }
}



