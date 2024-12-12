"use client";
import React, { useState } from "react";
import Link from "next/link";
import { RiUserSettingsFill } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { IoShareSocial } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import MiniProfile from "./MiniProfle";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  // Split the pathname by '/' and get the last portion
  const lastSegment = pathname.split('/').filter(Boolean).pop();
  const [activeItem, setActiveItem] = useState(lastSegment);
  if (pathname) {
  }
  const menuItems = [
    { id: "basicinfo", icon: <RiUserSettingsFill />, label: "Basic Info" },
    { id: "security", icon: <GrShieldSecurity />, label: "Security" },
    { id: "socialAccounts", icon: <IoShareSocial />, label: "Social Accounts" },
    { id: "deleteAccount", icon: <MdDelete />, label: "Delete Account" },
  ];

  return (
    <section className="sidebar slg:w-72 h-auto slg:h-[746px] bg-white text-gray-700">
      <div className="px-4 pt-4 hidden slg:block text-xl slg:text-3xl font-medium text-gray-600">
        <MiniProfile title={"Settings"} />
      </div>
      <ul className="settings_items px-4 py-4 font-medium">
        {menuItems.map((item) => (
          <li key={item.id} className="text-3xl slg:text-2xl py-2 slg:py-4">
            <Link
              href={`/me/settings/${item.id}`}
              className="flex gap-2 items-center"
              onClick={() => setActiveItem(item.id)}
            >
              <span className={activeItem === item.id ? "text-blue-500" : ""}>
                {item.icon}
              </span>
              <span
                className={`hidden slg:block ${
                  activeItem === item.id ? "text-blue-500" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
