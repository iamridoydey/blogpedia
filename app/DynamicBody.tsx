"use client"
import { usePathname } from "next/navigation"

export default function DynamicBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullWidth =
    pathname.startsWith("/me") ||
    pathname.startsWith("/blog") ||
    pathname === "/";

  return (
    <div className={`app_wrapper ${fullWidth ? "" : "max-w-screen-xl mx-auto px-4"}`}>
      {children}
    </div>
  );
}