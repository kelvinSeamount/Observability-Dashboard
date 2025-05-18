import { useState, useRef, useEffect } from "react";
import { TIME_RANGES } from "../../config/constants";
import { ChevronDown } from "lucide-react";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption =
    TIME_RANGES.find((option) => option.value === value) || TIME_RANGES[0];

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-between w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption.label}
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
          <div className="py-1">
            {TIME_RANGES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`block w-full text-left px-4 py-2 text-sm ${
                  option.value === value
                    ? "bg-gray-100 dark:bg-gray-700 text-primary"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;
