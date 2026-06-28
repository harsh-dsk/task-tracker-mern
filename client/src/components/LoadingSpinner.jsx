/**
 * LoadingSpinner.jsx — Reusable animated loading indicators.
 *
 * Props:
 *  size     — "sm" | "md" | "lg" | "page"  (default "md")
 *  text     — optional label below the spinner
 */

const sizeMap = {
  sm:   "w-4 h-4 border-2",
  md:   "w-8 h-8 border-2",
  lg:   "w-12 h-12 border-[3px]",
  page: "w-16 h-16 border-4",
};

const LoadingSpinner = ({ size = "md", text }) => {
  const spinClass = sizeMap[size] ?? sizeMap.md;

  if (size === "page") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 animate-fade-in">
        <div
          className={`${spinClass} rounded-full border-primary-200 dark:border-primary-900
                      border-t-primary-600 dark:border-t-primary-400 animate-spin`}
        />
        {text && (
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${spinClass} rounded-full border-primary-200 dark:border-primary-900
                    border-t-primary-600 dark:border-t-primary-400 animate-spin`}
      />
      {text && (
        <span className="text-sm text-slate-400 dark:text-slate-500">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
