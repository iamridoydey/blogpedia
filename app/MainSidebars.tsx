"use client";
import { usePathname } from "next/navigation";
import ProfileBlock from "./components/main/ProfileBlock";
import TagsBlock from "./components/main/TagsBlock";
import UsersBlock from "./components/main/UsersBlock";
import CreatePostMain from "./components/main/CreatePostMain";
import BlogsBlock from "./components/main/BlogsBlock";

export default function MainSideBars({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebars =
    pathname.startsWith("/me") ||
    pathname.startsWith("/blog") ||
    pathname === "/" ||
    pathname.startsWith("/auth");

  return (
    <main className="app_wrapper p-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_5fr_2fr] gap-4 w-full">
        {/* left sidebars = miniprofile, tags */}
        {!hideSidebars && (
          <div className="left_sidebars flex flex-col gap-4">
            <div className="sticky">
              <ProfileBlock />
            </div>
            <div className="sticky">
              <TagsBlock numberOfTags={10} />
            </div>
          </div>
        )}

        <div className="main_content">
          <div className="create_post">
            <CreatePostMain />
          </div>
          <div className="infinite_contents">{children}</div>
        </div>

        {/* right sidebars = users, blogs */}
        {!hideSidebars && (
          <div className="right_sidebars flex flex-col gap-4">
            <div className="sticky">
              <UsersBlock limitUsers={2} />
            </div>
            <div className="sticky">
              <BlogsBlock limitBlogs={2} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
