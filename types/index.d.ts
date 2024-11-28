import {Types} from "mongoose"

export interface User {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  profilePic?: string | null;
  occupation: string;
  password: string;
  followers: User[];
  following: User[];
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