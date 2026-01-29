import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 py-10">
      <div className="custom-loader"></div>
    </div>
  );
};

export default LoadingSpinner;
