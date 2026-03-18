import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="mt-6 text-neutral-500 font-medium tracking-wide animate-pulse">
        Loading experience...
      </div>
    </div>
  );
};

export default Loading;
