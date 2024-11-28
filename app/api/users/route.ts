import UserModel from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";


// Connect database
dbConnect()


export default async function createUser(req: NextApiRequest, res: NextApiResponse){
  const body = req.body;
  
  if (!body) res.status(404).json({message: "Provide all data"});

  try{
    const {firstname, lastname, username, email, password} = body;

    // Check if any required fields are missing
    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds of salting
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt


    // Create a new user
    const newUser = new UserModel({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      occupation: "Developer",
      profilePic: null,
      followers: [],
      following: []
    })


    // Save the user
    const savedUser = await newUser.save();

    // return the saved user
    return res.status(201).json(savedUser);
  } catch(err: any){
    return res.status(500).json({message: `Error Creating User: ${err.message}`});
  }
}