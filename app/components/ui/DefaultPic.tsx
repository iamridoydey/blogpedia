"use client";
export default function DefaultPic({ shortname }: { shortname: string }) {
  return (
    <div className="w-full h-full rounded-full bg-blue-400 relative flex items-center justify-center">
      <span className="text-white font-bold text-sm">{shortname}</span>
    </div>
  );
}
