"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "calipuff_disclaimer_accepted";

export default function DisclaimerPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check if user has already seen and accepted the disclaimer
    const hasAccepted = localStorage.getItem(STORAGE_KEY);
    
    if (!hasAccepted) {
      setIsMounted(true);
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isMounted) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[9999] max-w-sm w-[calc(100%-2rem)] sm:max-w-md transition-all duration-300 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 sm:p-6 space-y-4">
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            Уся продукція, представлена на нашому сайті (вейпи, картриджі, рідини, товари з канабіноїдами), призначена виключно для сувенірних, декоративних або дослідницьких цілей. Продукція не призначена для вживання, куріння або інших способів використання, що можуть суперечити законодавству.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
}

