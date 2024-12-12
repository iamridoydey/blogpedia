"use client";
import { useSession } from "next-auth/react";
import AuthNavbar from "./AuthNavbar";
import NewUserNavbar from "./NewUserNavbar";
import LimitedNavbar from "./LimitedNavbar";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const isLimitedNav =
    pathname.startsWith("/me") || pathname.startsWith("/blog");
  const { data: session } = useSession();
  const navRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setHeight(navRef.current.offsetHeight);
    }
  }, [navRef]);

  return (
    <section className="h-full w-full">
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-sm"
      >
        {session ? (
          isLimitedNav ? (
            <LimitedNavbar />
          ) : (
            <AuthNavbar />
          )
        ) : (
          <NewUserNavbar />
        )}
      </div>
      <div style={{ height: `${height}px`, backgroundColor: "#c6cade" }}></div>
    </section>
  );
}
