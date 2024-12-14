import SignIn from "@/app/components/auth/SignIn";
import SignUp from "@/app/components/auth/SignUp";

interface Params {
  module: string;
}

export default function AuthPage({ params }: { params: Params }) {
  const { module } = params;

  return (
    <div className="wrapper">
      {module === "signin" ? <SignIn /> : <SignUp />}
    </div>
  );
}
