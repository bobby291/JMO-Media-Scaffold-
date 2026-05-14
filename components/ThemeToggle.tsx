"use client";

import { Moon, Sun } from "lucide-react";
import React from "react";

export default function ThemeToggle() {
  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("jmo-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("jmo-theme", nextIsDark ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-[80] grid size-12 place-items-center rounded-full border border-black/10 bg-white text-[#191919] shadow-xl transition hover:scale-105 dark:border-white/10 dark:bg-[#242424] dark:text-white"
      aria-label="Toggle light and dark screen"
      title="Toggle screen"
    >
      <Moon className="dark:hidden" size={20} />
      <Sun className="hidden dark:block" size={20} />
    </button>
  );
}
