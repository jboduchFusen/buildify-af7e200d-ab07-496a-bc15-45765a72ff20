
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useRef, useEffect } from "react";
import '../styles/theme-toggle.css';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="theme-toggle-dropdown" ref={dropdownRef}>
      <button 
        className="theme-toggle-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
      >
        <Sun className={`theme-icon sun ${theme !== 'dark' ? 'visible' : 'hidden'}`} />
        <Moon className={`theme-icon moon ${theme === 'dark' ? 'visible' : 'hidden'}`} />
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          <button 
            className="theme-option" 
            onClick={() => { setTheme("light"); setIsOpen(false); }}
          >
            Light
          </button>
          <button 
            className="theme-option" 
            onClick={() => { setTheme("dark"); setIsOpen(false); }}
          >
            Dark
          </button>
          <button 
            className="theme-option" 
            onClick={() => { setTheme("system"); setIsOpen(false); }}
          >
            System
          </button>
        </div>
      )}
    </div>
  );
}