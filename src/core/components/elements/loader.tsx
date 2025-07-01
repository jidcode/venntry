import React from "react";

export default function CustomLoader() {
  return (
    <div className="pad flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-secondary mx-auto"></div>
        <p className="mt-6 text-neutral">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-1 w-6 h-6">
      <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1s_infinite] delay-100" />
      <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1s_infinite] delay-200" />
      <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1s_infinite] delay-600" />
    </div>
  );
}
