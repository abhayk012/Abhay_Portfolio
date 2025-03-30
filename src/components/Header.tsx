"use client";

import { useState, useEffect } from "react";
import { Menu, X, CloudRain, CloudSnow, Computer } from "lucide-react";
import { useTheme } from "./theme-provider";
import Toggle from "./Toggle";
import { cn } from "@/lib/utils";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    theme === "dark" ||
      theme === "rain" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === "system") {
        setIsDarkMode(
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );
      } else {
        setIsDarkMode(theme === "dark" || theme === "rain");
      }
    };

    updateDarkMode();

    // Listen for system theme changes if using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateDarkMode();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleThemeToggle = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    // Set the appropriate theme
    if (newIsDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
    className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out",
      scrolled
        ? "bg-background/95 backdrop-blur-xl shadow-2xl py-3"
        : "py-6 bg-background/80",
      isDarkMode ? "shadow-neutral-800/10" : "shadow-neutral-200/10"
    )}
  >
    <div className="container mx-auto px-4 flex justify-between items-center">
      {/* Enhanced Logo */}
      <a
        href="#home"
        className="group text-2xl font-bold relative overflow-hidden"
      >
        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-500 group-hover:translate-y-0 inline-block -translate-y-1">
          Abhay
        </span>
        <span className="ml-1.5 text-foreground/90 group-hover:text-primary transition-colors duration-300">
          Krishnan
        </span>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="relative text-foreground/85 hover:text-primary transition-colors duration-300 group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        ))}

        {/* Enhanced Theme Controls */}
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
          <Toggle
            handleChange={handleThemeToggle}
            isChecked={isDarkMode}
            className="data-[state=checked]:bg-primary/90 data-[state=unchecked]:bg-foreground/20"
          />

          <div className="flex gap-1.5">
            <button
              onClick={() => setTheme("system")}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                theme === "system"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:bg-muted/50 hover:text-foreground"
              )}
              title="System Theme"
            >
              <Computer className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme("rain")}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                theme === "rain"
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-foreground/60 hover:bg-muted/50 hover:text-blue-400"
              )}
              title="Rain Theme"
            >
              <CloudRain className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme("snowfall")}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                theme === "snowfall"
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-foreground/60 hover:bg-muted/50 hover:text-sky-400"
              )}
              title="Snow Theme"
            >
              <CloudSnow className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-3">
        <Toggle
          handleChange={handleThemeToggle}
          isChecked={isDarkMode}
          className="data-[state=checked]:bg-primary/90 data-[state=unchecked]:bg-foreground/20"
        />
        <button
          onClick={toggleMenu}
          className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-300 text-foreground/80 hover:text-primary"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>

    {/* Enhanced Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-4">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="py-2.5 px-4 rounded-lg text-foreground/85 hover:bg-muted/50 hover:text-primary transition-all duration-300 flex items-center group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-[3px] h-6 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-3" />
                {item.name}
              </a>
            ))}

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <button
                onClick={() => {
                  setTheme("system");
                  setIsDarkMode(
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                  );
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                  theme === "system"
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-muted/50"
                )}
              >
                <Computer className="h-5 w-5 flex-shrink-0" />
                <span>System Theme</span>
              </button>
              <button
                onClick={() => {
                  setTheme("rain");
                  setIsDarkMode(true);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                  theme === "rain"
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-foreground/75 hover:bg-muted/50"
                )}
              >
                <CloudRain className="h-5 w-5 flex-shrink-0" />
                <span>Rain Theme</span>
              </button>
              <button
                onClick={() => {
                  setTheme("snowfall");
                  setIsDarkMode(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                  theme === "snowfall"
                    ? "bg-sky-500/10 text-sky-400"
                    : "text-foreground/75 hover:bg-muted/50"
                )}
              >
                <CloudSnow className="h-5 w-5 flex-shrink-0" />
                <span>Snow Theme</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    )}
  </header>
  );
};

export default Header;
