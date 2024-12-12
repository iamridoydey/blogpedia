/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Loader from "../../ui/Loader";

const DeleteAccount: React.FC = () => {
  const { data: session } = useSession();
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const userId = session?.user?.id;

  const handleDelete = useCallback(async () => {
    if (confirmationText !== "I want to delete my account") {
      setError("The confirmation text does not match.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Show the custom modal
      setShowModal(true);
    } catch (error:any) {
      console.error("Error deleting account:", error);
      setError(`Error deleting account: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  }, [confirmationText, userId]);

  const handleCloseModal = async () => {
    setShowModal(false);
    await signOut({ callbackUrl: "/" });
  };

  if (!userId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[744px] mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
      <p className="mb-4">
        To delete your account, please type{" "}
        <span className="text-red-500">I want to delete my account</span> in the
        input field below and click the delete button.
      </p>
      <input
        type="text"
        value={confirmationText}
        onChange={(e) => setConfirmationText(e.target.value)}
        className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-500"
        placeholder="Type here..."
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="button"
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Account"}
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-xl font-bold mb-4">Account Deleted</h3>
            <p className="mb-4">Your account has been successfully deleted.</p>
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
