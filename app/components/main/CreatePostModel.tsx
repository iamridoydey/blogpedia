/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Editor, EditorState, convertToRaw, Modifier } from "draft-js";
import { LiaTimesSolid } from "react-icons/lia";
import Picker from "@emoji-mart/react";
import "draft-js/dist/Draft.css";
import { CiFaceSmile } from "react-icons/ci";
import DefaultPic from "../ui/DefaultPic";
import Image from "next/image";
import { user } from "@/app/dummydata/user";
import { SlPicture } from "react-icons/sl";

interface Post {
  content: string;
  picture?: string;
  tags: string[];
  userId: string;
}

interface CreatePostModalProps {
  uploadedPhotoURL: string | null;
  uploading: boolean;
  onClose: () => void;
}

interface User {
  firstname: string;
  lastname: string;
  profilePic: string;
  username: string;
}

export default function CreatePostModal({
  uploadedPhotoURL,
  onClose,
}: CreatePostModalProps) {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User>(user);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [tags, setTags] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { firstname, lastname, profilePic, username } = userDetails;
  const shortname: string = firstname[0] + (lastname ? lastname[0] : "");

  // Get user data
  useEffect(() => {
    const userData = async () => {
      if (session?.user.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserDetails(data);
          }
        } catch (error: any) {
          console.log("Error getting user ", error.message);
        }
      }
    };

    userData();
  }, [session?.user.id]);

  // Handle click outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("User not logged in");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    const newPost: Post = {
      content: rawContent,
      picture: uploadedPhotoURL || "",
      tags,
      userId: session.user.id,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      onClose();
      setEditorState(EditorState.createEmpty());
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  const addEmoji = (emoji: any) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithEmoji = Modifier.insertText(
      contentState,
      selectionState,
      emoji.native
    );
    const newEditorState = EditorState.push(
      editorState,
      contentStateWithEmoji,
      "insert-characters"
    );
    setEditorState(newEditorState);
  };

  return (
    <div className="create-post-modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-xl mx-4 relative">
        <h2 className="text-2xl font-bold mb-2 ">Create Post</h2>
        <button
          type="button"
          className="p-2 bg-slate-300 text-gray-700 font-bold rounded-full hover:bg-gray-400 text-xl absolute right-4 top-4"
          onClick={onClose}
        >
          <LiaTimesSolid />
        </button>
        <hr className="w-full my-4" />
        <section className="user_details flex gap-1 items-center text-xl mb-2">
          <figure className="w-12 h-12 rounded-full bg-white overflow-hidden">
            {profilePic ? (
              <Image
                src={profilePic}
                className="w-full h-full rounded"
                width={100}
                height={100}
                alt="profile pic"
              />
            ) : (
              <DefaultPic shortname={shortname} />
            )}
          </figure>
          <h3 className="">{`${firstname} ${lastname}` || username}</h3>
        </section>
        <section className="main_content relative">
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              className="emoji_picker absolute top-0 right-0 z-20 max-w-full max-h-80 overflow-y-auto"
              ref={emojiPickerRef}
            >
              <Picker
                data-emoji-mart
                onEmojiSelect={addEmoji}
                className="emoji-picker-responsive"
              />
            </div>
          )}
          <div className="text_content text-gray-700 mr-8 mb-4">
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              placeholder={`What's on your mind ${userDetails?.firstname}?`}
            />
          </div>
          <div className="emoji">
            <button
              type="button"
              className="ml-0 p-1 text-slate-800 rounded-full hover:bg-gray-200 text-2xl absolute right-0 top-0 z-10"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <CiFaceSmile />
            </button>
          </div>
        </section>

        <section className="addons"></section>

        <div className="flex justify-between items-center">
          <button className="thumbnail w-6 h-6 text-blue-500">
            <SlPicture  className="w-full h-full"/>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handlePostSubmit}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}
