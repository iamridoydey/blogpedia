// import { Types } from "mongoose";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    // firstname: string;
    // lastname: string;
    // username: string;
    // profilepic?: string;
    // occupation: string;
    // isVerified: boolean;
    // followers: Types.ObjectId[];
    // following: Types.ObjectId[];
    // authProvider: string;
  }

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string; // Optional ID for the token
  }
}
  interface Session extends DefaultSession {
    user: User
  }
}
