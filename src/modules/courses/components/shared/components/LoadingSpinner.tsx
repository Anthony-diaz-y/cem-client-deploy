"use client";

import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-full bg-white py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="custom-loader"></div>
        </div>
      </div>
    </div>
  );
};
