import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { SunIcon, MoonIcon, MonitorIcon } from "./Icons";

const themes: { value: Theme; label: string; icon: React.ComponentType }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "classic", label: "Classic", icon: MonitorIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 classic:text-classic-600 classic:hover:bg-classic-100"
        aria-label="Toggle theme"
      >
        {currentTheme && <currentTheme.icon />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-hover dark:border-slate-700 dark:bg-slate-800 classic:border-classic-300 classic:bg-classic-50"
            >
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    theme === value
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 classic:bg-classic-200 classic:text-classic-900"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 classic:text-classic-700 classic:hover:bg-classic-100"
                  }`}
                >
                  <Icon />
                  <span>{label}</span>
                  {theme === value && (
                    <svg
                      className="ml-auto h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
