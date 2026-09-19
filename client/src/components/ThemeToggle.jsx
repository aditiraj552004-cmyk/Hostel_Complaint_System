import {
  useTheme,
} from "../context/ThemeContext";

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex items-center gap-2
        px-4 py-2
        rounded-lg
        font-semibold
        bg-white
        text-blue-600
        hover:bg-gray-100
        dark:bg-gray-800
        dark:text-yellow-300
        dark:hover:bg-gray-700
        transition-colors
        duration-300
      "
    >
      {theme === "light"
        ? "🌙 Dark"
        : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;