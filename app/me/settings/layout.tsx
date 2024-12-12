import Sidebar from "@/app/components/me/Sidebar";
import React from "react";
const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex">
      <Sidebar />
      <section className="flex-grow p-4">{children}</section>
    </div>
  );
};
export default SettingsLayout;
