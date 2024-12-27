/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Editor,
  EditorState,
  convertToRaw,
  Modifier,
} from "draft-js";
import { LiaTimesSolid } from "react-icons/lia";
import Picker from "@emoji-mart/react";
import "draft-js/dist/Draft.css";
import { CiFaceSmile } from "react-icons/ci";

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
}

export default function CreatePostModal({
  uploadedPhotoURL,
  onClose,
}: CreatePostModalProps) {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [tags, setTags] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        <section className="main_content">
          <div className="text_content">
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              placeholder={`What's on your mind ${userDetails?.firstname}?`}
            />
          </div>
        </section>

        {showEmojiPicker && (
          <Picker
            data-emoji-mart
            onEmojiSelect={addEmoji}
            className={`w-[300px]`}
          />
        )}
        <button
          type="button"
          className="ml-0 p-1 text-slate-800 rounded-full hover:bg-gray-200 text-2xl"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <CiFaceSmile />
        </button>
        <div className="flex justify-end">
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
