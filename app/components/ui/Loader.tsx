import React from "react";
import "../../styles/Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="w-full max-w-[680px] h-[680px] bg-white p-6 rounded-lg shadow-lg flex flex-col items-start justify-start relative">
      <h1 className="text-2xl font-bold mb-2">Loader</h1>
      <hr className="w-full border-t border-gray-300 mb-4" />
      <div className="w-full h-full flex items-center justify-center">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader;
