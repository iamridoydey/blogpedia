import SignIn from "@/app/components/auth/SignIn";
import SignUp from "@/app/components/auth/SignUp";

export default async function AuthPage({params}: {params: {module: string}}) {

  // params in dynamic routes need to use async
  const {module} = await params;
  return (
    <div className="wrapper ">
      {
        module == "signin"? <SignIn/> : <SignUp/>
      }
      
    </div>
  );
}
