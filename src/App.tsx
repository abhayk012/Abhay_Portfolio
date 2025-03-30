"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FunActivity from "./components/FunActivity";
import "./App.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import WeatherSection from "./components/WeatherSection";

// Register GSAP plugins once at the app level
gsap.registerPlugin(ScrollTrigger, Observer, Draggable);

// Create Material UI theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // Tailwind blue-500
    },
    secondary: {
      main: "#10b981", // Tailwind emerald-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Shorter loading time
    setTimeout(() => {
      setLoading(false);
    }, 800);

    // Set up ScrollTrigger refresh on resize for better responsiveness
    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };

    window.addEventListener("resize", handleResize);

    // Ensure section headings are visible
    document
      .querySelectorAll(
        ".main-title, .subtitle, .decorative-line, .decorative-dot"
      )
      .forEach((el) => {
        gsap.set(el, { opacity: 1, visibility: "visible" });
      });

    // Set up global Observer for subtle parallax effects on scroll
    Observer.create({
      type: "wheel,touch,scroll",
      onDown: () => {
        gsap.to(".parallax-slow", {
          y: "+=15",
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(".parallax-fast", {
          y: "+=25",
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      },
      onUp: () => {
        gsap.to(".parallax-slow", {
          y: "-=15",
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(".parallax-fast", {
          y: "-=25",
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    // Set up smooth scrolling
    const smoothScroll = () => {
      const scrollElements = document.querySelectorAll("[data-speed]");

      scrollElements.forEach((element) => {
        const speed = Number.parseFloat(
          element.getAttribute("data-speed") || "1"
        );

        gsap.to(element, {
          y: () => (1 - speed) * window.scrollY,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.1,
          },
        });
      });
    };

    // Initialize smooth scrolling
    smoothScroll();

    // Set up scroll-based navigation highlighting
    const sections = document.querySelectorAll("section[id]");

    const highlightNavOnScroll = () => {
      const scrollY = window.scrollY;

      sections.forEach((section) => {
        const sec = section as HTMLElement;
        const sectionHeight = sec.offsetHeight;
        const sectionTop = sec.offsetTop - 100;
        const sectionId = section.getAttribute("id");

        if (
          sectionId &&
          scrollY > sectionTop &&
          scrollY <= sectionTop + sectionHeight
        ) {
          document
            .querySelectorAll(`a[href*="#${sectionId}"]`)
            .forEach((link) => {
              link.classList.add("text-primary");
            });
        } else if (sectionId) {
          document
            .querySelectorAll(`a[href*="#${sectionId}"]`)
            .forEach((link) => {
              link.classList.remove("text-primary");
            });
        }
      });
    };

    window.addEventListener("scroll", highlightNavOnScroll);

    // Force ScrollTrigger refresh after a short delay to ensure all content is properly measured
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", highlightNavOnScroll);
      // Clean up all ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearMatchMedia();
      // Kill all observers
      Observer.getAll().forEach((observer) => observer.kill());
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin mb-4"></div>
        <div className="text-xl font-bold text-primary">
          <span className="inline-block animate-pulse">
            Loading Portfolio...
          </span>
        </div>
      </div>
    );
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
        <div className="min-h-screen overflow-hidden bg-background text-black dark:text-foreground transition-colors duration-300">
          <Header />
          <main className="smooth-scroll">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <FunActivity />
            <Contact />
            <WeatherSection/>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
