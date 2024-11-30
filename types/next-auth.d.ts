import { Types } from "mongoose";
import { DefaultSession, DefaultUser } from "next-auth";
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    profilepic?: string;
    occupation: string;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
  }

  interface Session extends DefaultSession {
    user: User;
  }
}
