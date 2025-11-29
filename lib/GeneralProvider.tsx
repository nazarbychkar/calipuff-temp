"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBasketOpen: boolean;
  setIsBasketOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<ContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  isBasketOpen: false,
  setIsBasketOpen: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});

import { ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Always use light theme
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isBasketOpen,
        setIsBasketOpen,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easier access
export const useAppContext = () => useContext(AppContext);
