export const ProgressBar = ({ percent }: { percent: number }) => {
  return (
    <div className="relative w-full h-full">
      <svg
        className="size-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200 dark:text-neutral-700"
          stroke-width="4"
        ></circle>
        {/* Progress Circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-blue-600 dark:text-blue-500"
          stroke-width="4"
          stroke-dasharray="100"
          stroke-dashoffset={percent? `${100 - percent}` : 100}
          stroke-linecap="round"
        ></circle>
      </svg>

      {/* Percentage Text */}
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">
          {percent? `${percent}%` : `${0}%`}
        </span>
      </div>
    </div>
  );
};
