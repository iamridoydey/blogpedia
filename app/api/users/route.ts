/* eslint-disable @typescript-eslint/no-explicit-any */
import UserModel from "@/models/user";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
dbConnect();

// Handle POST request to create a new user
export async function POST(req: NextRequest) {
  const { firstname, lastname, username, email, password } = await req.json();

  // Check if required fields are missing
  if (!firstname || !lastname || !email || !username || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the email is already taken
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new UserModel({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      occupation: "Developer",
      profilePic: "",
      followers: [],
      following: [],
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return the saved user
    return NextResponse.json(savedUser, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Error Creating User: ${err.message}` },
      { status: 500 }
    );
  }
}

// Get all users
export async function GET() {
  try {
    const allUser = await UserModel.find({});
    return NextResponse.json(allUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error Getting User: ${error.message}` },
      { status: 500 }
    );
  }
}
