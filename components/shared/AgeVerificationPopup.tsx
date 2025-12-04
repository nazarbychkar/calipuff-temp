"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "calipuff_age_verified";

export default function AgeVerificationPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem(STORAGE_KEY);
    
    if (!hasVerified) {
      setIsMounted(true);
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Redirect to a safe page or show message
    alert("Вибачте, наш сайт доступний лише для повнолітніх користувачів (18+).");
    // Optionally redirect to external site
    // window.location.href = "https://www.google.com";
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] transition-opacity duration-300"
          style={{
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}
      
      {/* Popup */}
      <div 
        className={`fixed inset-0 z-[10001] flex items-center justify-center p-4 transition-all duration-300 ${
          isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-gray-900 font-['Montserrat']">
              18+
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Montserrat']">
              Підтвердіть ваш вік
            </h2>
            <p className="text-base sm:text-lg text-gray-700 font-['Poppins'] leading-relaxed">
              Продукція доступна лише для повнолітніх користувачів (18+). 
              Чи підтверджуєте ви, що вам вже виповнилося 18 років?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#ff8c00] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2 text-base sm:text-lg"
            >
              Так, мені 18+
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-base sm:text-lg"
            >
              Ні, мені менше 18
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

