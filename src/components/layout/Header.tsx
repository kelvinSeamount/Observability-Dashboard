import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default Header;
