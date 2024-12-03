// app/auth/layout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h1 className="text-center text-2xl font-semibold mb-6">
          Welcome to My App
        </h1>
        {/* The children will be either Sign In or Sign Up form */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
