"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import {
  IoMdEye,
  IoMdEyeOff,
  IoLogoGithub,
  IoLogoLinkedin,
} from "react-icons/io";

export default function SignIn() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState<string | null>(null);
  const [isPassView, setIsPassView] = useState(false);

  function handleOnEmailChange(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    setHasEmailError(!validateEmail(target.value));
    setEmailValue(target.value);
  }

  function handleOnPasswordChange(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    setPasswordValue(target.value);
  }

  const validateEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Handle On submit
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // signIn from nextauth
    const res = await signIn("credentials", {
      redirect: false,
      email: emailValue,
      password: passwordValue,
    });


    setEmailValue("");
    setPasswordValue("");

    if (res?.error) {
      setErrorMessage("Invalid email or password");
    } else {
      router.push("/feed");
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <section className="signin_wrapper max-w-[420px] mx-auto mt-12">
      <div className="signin_main bg-white p-10 rounded-md">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <h4>Level up your skill by reading & writing blog</h4>
        <h3
          className={`mt-2 text-lg text-red-600 ${
            errorMessage ? "visible" : "invisible min-h-[1.5rem]"
          }`}
        >
          {errorMessage}
        </h3>
        <form className="flex flex-col mt-4" onSubmit={handleOnSubmit}>
          <div className="email_wrapper">
            <div
              className={`email_input_wrapper border-[2px] border-gray-500 focus-within:border-bp_primary rounded-md relative ${
                hasEmailError ? "border-red-600" : ""
              }`}
            >
              <input
                onChange={handleOnEmailChange}
                type="email"
                name="email"
                id="email"
                value={emailValue}
                required
                aria-invalid={hasEmailError}
                className={`w-full outline-none p-3 text-lg bg-transparent peer focus:pb-0 focus:mt-3 ${
                  hasEmailError ? "text-red-600" : "text-gray-600"
                } ${emailValue ? "pb-0 mt-3" : ""}`}
              />
              <label
                htmlFor="email"
                aria-hidden="true"
                className={`absolute left-3 transition-all 
                  peer-focus:top-0 peer-focus:text-sm  ${
                    emailValue ? "text-sm top-0" : "top-3 text-xl"
                  }`}
              >
                Email
              </label>
            </div>
            <div
              error-for="email"
              role="alert"
              aria-live="assertive"
              className={`${
                hasEmailError ? "text-red-600" : "hidden"
              } text-sm mt-1`}
            >
              Please enter a valid email
            </div>
          </div>

          <div className="password_wrapper mt-4">
            <div
              className={`password_input_wrapper border-[2px] rounded-md relative border-gray-500 focus-within:border-bp_primary ${
                passwordValue == "" ? "border-red-600" : ""
              }`}
            >
              <input
                onChange={handleOnPasswordChange}
                type={`${isPassView ? "text" : "password"}`}
                name="password"
                id="password"
                value={passwordValue == null ? "" : passwordValue}
                required
                className={`w-full outline-none p-3 text-lg bg-transparent text-gray-600 peer focus:pb-0 focus:mt-3 ${
                  passwordValue ? "pb-0 mt-3" : ""
                }`}
              />
              <label
                htmlFor="password"
                aria-hidden="true"
                className={`absolute left-3 transition-all 
                  peer-focus:top-0 peer-focus:text-sm  ${
                    passwordValue ? "text-sm top-0" : "top-3 text-xl"
                  }`}
              >
                Password
              </label>
              <div
                className="eye_view absolute top-4 right-2 text-2xl cursor-pointer"
                onClick={() => setIsPassView(!isPassView)}
              >
                {isPassView ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
            </div>
            <div
              error-for="password"
              role="alert"
              aria-live="assertive"
              className={`${
                passwordValue == null || passwordValue
                  ? "hidden"
                  : "text-red-600"
              } text-sm mt-1`}
            >
              Please enter a password
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-bp_primary text-white p-3 rounded-md transition-all"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* -------- or -------- */}
        <div className="flex items-center mt-4">
          <span className="flex-grow border-t border-gray-400"></span>
          <span className="px-4 text-gray-600">or</span>
          <span className="flex-grow border-t border-gray-400"></span>
        </div>

        {/* third party authentication */}
        <div className="third_party_auth">
          <button
            onClick={() => signIn("github", { callbackUrl: "/feed" })}
            className="w-full mt-4 bg-black text-white p-3 rounded-md flex justify-center items-center gap-2 hover:bg-gray-600"
          >
            <span>Sign in with github</span>
            <span className="text-xl">
              <IoLogoGithub />
            </span>
          </button>
          <button
            onClick={() => signIn("linkedin", { callbackUrl: "/feed" })}
            className="w-full mt-4 bg-bp_primary text-white p-3 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700"
          >
            <span>Sign in with linkedin</span>
            <span className="text-xl ">
              <IoLogoLinkedin />
            </span>
          </button>
        </div>
        {/* Redirect to signup */}
        <div className="flex gap-2 justify-center text-[16px] mt-4">
          <span>New to blogpedia?</span>
          <Link className="text-blue-600 font-semibold" href="./signup">
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}
