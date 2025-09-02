"use client";

import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono">
      {/* Terminal Window */}
      <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm">initializing_portfolio.js</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-green-400">
            <span className="text-gray-500">$</span> npm run start
          </div>
          <div className="text-gray-300">Loading components...</div>
          <div className="text-gray-300">Initializing matrix...</div>
          <div className="text-gray-300">Compiling portfolio data...</div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-green-400 flex items-center mt-4">
            <span className="animate-pulse mr-2">●</span>
            Ready to launch...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
