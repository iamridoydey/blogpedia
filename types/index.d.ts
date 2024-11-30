import {Types} from "mongoose"

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  profilePic?: string;
  occupation: string;
  password: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

export interface Post{
  title: string;
  content: string;
  createdAt: Date;
  editedAt: Date;
  picture?: string | null;
  tags: string[];
  userId: Types.ObjectId;
}


export interface Comment{
  content: string;
  commentBy: Types.ObjectId;
  postId: Types.ObjectId;
}