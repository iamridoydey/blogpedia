"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [isValidPass, setIsValidPass] = useState<boolean | null>(null);
  const [isPassView, setIsPassView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  function handleOnEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setHasEmailError(!validateEmail(value));
  }

  function handleOnPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    setIsValidPass(validPassword(value));
  }

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(false);
    setIsSubmitting(true); 

    try {
      const response = await axios.post(
        "/api/users",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        // Clear the inputs after successful submission
        setEmail("");
        setPassword("");
        setIsSubmitting(false);

        router.push(`/dashboard`);
      } else {
        setSubmissionError(true);
        setIsSubmitting(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message);
      setSubmissionError(true);
      setIsSubmitting(false); 
    }
  };

  return (
    <section className="signup_wrapper max-w-[420px] mx-auto mt-12">
      <div className="signup_main bg-white p-10 rounded-md">
        <h1 className="text-3xl font-semibold">Signup</h1>
        <h4>Join Blogpedia community.</h4>
        <form className="flex flex-col mt-8" onSubmit={handleOnSubmit}>
          {/* Email Input */}
          <div className="email_wrapper">
            <div
              className={`email_input_wrapper border-[2px] rounded-md relative ${
                hasEmailError ? "border-red-600" : "border-gray-500"
              }`}
            >
              <input
                onChange={handleOnEmailChange}
                type="email"
                name="email"
                id="email"
                value={email}
                required
                aria-invalid={hasEmailError}
                className={`w-full outline-none p-3 text-lg bg-transparent peer ${
                  hasEmailError ? "text-red-600" : "text-gray-600"
                }`}
              />
              <label
                htmlFor="email"
                className={`absolute left-3 transition-all ${
                  email ? "text-sm top-0" : "top-3 text-xl"
                }`}
              >
                Email
              </label>
            </div>
            {hasEmailError && (
              <div className="text-red-600 text-sm mt-1">
                Please enter a valid email.
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="password_wrapper mt-4">
            <div
              className={`password_input_wrapper border-[2px] rounded-md relative ${
                isValidPass === false ? "border-red-600" : "border-gray-500"
              }`}
            >
              <input
                onChange={handleOnPasswordChange}
                type={isPassView ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                required
                className="w-full outline-none p-3 text-lg bg-transparent text-gray-600 peer"
              />
              <label
                htmlFor="password"
                className={`absolute left-3 transition-all ${
                  password ? "text-sm top-0" : "top-3 text-xl"
                }`}
              >
                Password (6+ characters)
              </label>
              <div
                className="eye_view absolute top-4 right-2 text-2xl cursor-pointer"
                onClick={() => setIsPassView(!isPassView)}
              >
                {isPassView ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
            </div>
            {isValidPass === false && (
              <div className="text-red-600 text-sm mt-1">
                Password must be 6+ characters, with 1 uppercase, 1 number, and
                1 special character.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting} 
            className={`mt-4 p-3 rounded-md ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-bp_primary text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "JOIN"}{" "}
            {/* Change text when submitting */}
          </button>

          {submissionError && (
            <div className="text-red-600 mt-2">
              Signup failed. Please try again.
            </div>
          )}

          {/* Success or Error message */}
          {!submissionError && email && password && !hasEmailError && isValidPass && !isSubmitting && (
            <div className="text-green-600 mt-2">
              All looks good! Ready to submit.
            </div>
          )}
        </form>

        {/* Redirect to Sign In */}
        <div className="flex justify-center mt-4">
          <span>Already have an account?</span>
          <Link href="/auth/signin" className="text-blue-600 ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
