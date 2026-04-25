import { Moon, Sun } from "lucide-react";
import { useTheme } from "../Features/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={20} className="text-gray-600" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;