"use client";
import { useSession } from "next-auth/react";
import AuthNavbar from "./AuthNavbar";
import NewUserNavbar from "./NewUserNavbar";
import LimitedNavbar from "./LimitedNavbar";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  // Check the current route
  const isLimitedNav =
    pathname.startsWith("/me") || pathname.startsWith("/blog");
  // Check whether user is logged in or not
  const { data: session } = useSession();

  return session ? (
    isLimitedNav ? (
      <LimitedNavbar />
    ) : (
      <AuthNavbar />
    )
  ) : (
    <NewUserNavbar />
  );
}
