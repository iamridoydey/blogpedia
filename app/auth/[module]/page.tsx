/* eslint-disable @typescript-eslint/no-explicit-any */
import SignIn from "@/app/components/auth/SignIn";
import SignUp from "@/app/components/auth/SignUp";

export default function AuthPage({ params }: { params: any }) {
  const { module } = params;

  return (
    <div className="wrapper">
      {module === "signin" ? <SignIn /> : <SignUp />}
    </div>
  );
}
