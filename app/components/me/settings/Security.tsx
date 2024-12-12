"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import bcrypt from "bcryptjs";
import Loader from "../../ui/Loader";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

const newPasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .refine((value) => passwordRegex.test(value), {
    message:
      "Password must contain at least one uppercase letter, one number, and one special character.",
  });

const Security: React.FC = () => {
  const { data: session } = useSession();
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<
    boolean | null
  >(null);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserAuthProvider = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          const data = await response.json();
          console.log("User Data:", data); // Debug statement
          setAuthProvider(data.authProvider);
          setHashedPassword(data.password); // Assuming the password is part of the user data
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserAuthProvider();
  }, [session]);

  const validateCurrentPassword = async () => {
    try {
      const isValid = await bcrypt.compare(currentPassword, hashedPassword);
      setIsCurrentPasswordValid(isValid);
      if (!isValid) {
        setError("Current password is incorrect.");
      } else {
        setError("");
      }
    } catch (error) {
      console.log("Failed to validate current password:", error);
      setIsCurrentPasswordValid(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    try {
      newPasswordSchema.parse(newPassword);
      if (newPassword !== retypePassword) {
        setError("New password and retype password do not match.");
        return;
      }

      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setSuccessMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");
      setIsCurrentPasswordValid(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Invalid password format.");
      } else {
        console.error("Error updating password:", err);
        setError("Error updating password.");
      }
    }
  };

  if (authProvider === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (authProvider !== "local") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[744px] mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Security</h2>
        <p className="text-gray-600">
          Password changes are managed through your {authProvider} account.
          Please visit your {authProvider} account settings to update your
          password.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[744px] mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Security</h2>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          validateCurrentPassword();
        }}
      >
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">
            Current Password*
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
            {isCurrentPasswordValid === true && (
              <span className="text-green-500 absolute inset-y-0 right-10 flex items-center pr-3 text-xl">
                <FaCheckCircle />
              </span>
            )}
            {isCurrentPasswordValid === false && (
              <span className="text-red-500 absolute inset-y-0 right-10 flex items-center pr-3 text-xl">
                <FaTimesCircle />
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {!isCurrentPasswordValid && (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Validate Current Password
            </button>
          )}
        </div>
      </form>
      {isCurrentPasswordValid && (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2 pt-6">
            <label className="block text-gray-600 font-medium">
              New Password*
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">
              Retype Password*
            </label>
            <div className="relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                name="retypePassword"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Security;
