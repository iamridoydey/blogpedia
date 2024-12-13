/* eslint-disable @typescript-eslint/no-explicit-any */
import UserModel from "@/models/user";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { userValidation } from "@/validation/signupValidation";
import { z } from "zod";
import { extractNameFromEmail } from "@/helperFunction/extractNameFromEmail";
import { generateUsername } from "@/helperFunction/generateUsername";

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

export async function GET() {
  try {
    await dbConnect();
    const allUsers = await UserModel.find({});
    return NextResponse.json(allUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error Getting Users: ${error.message}` },
      { status: 500 }
    );
  }
}
