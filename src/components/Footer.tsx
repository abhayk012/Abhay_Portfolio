"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUp,
} from "lucide-react";
import ChatBot from "./ChatBot";
import AichatBot from "./AichatBot";
import { cn } from "@/lib/utils";
import WeatherSection from "./WeatherSection";
import WeatherFooter from "./WeatherFooter";
import FooterWeather from "./WeatherFooter";

gsap.registerPlugin(ScrollTrigger, Observer);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;
    const links = linksRef.current;
    const copyright = copyrightRef.current;
    const circles = circlesRef.current;

    if (footer && content && links && copyright && circles) {
      // Circle animations
      gsap.fromTo(
        circles.children,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.1,
          duration: 1.5,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Footer content animation
      Observer.create({
        target: footer,
        type: "wheel,touch,scroll,pointer",
        onEnter: () => {
          gsap.context(() => {
            // Content animation
            gsap.from(content.children, {
              y: 40,
              opacity: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "power4.out",
            });

            // Links animation
            gsap.from(links.querySelectorAll(".footer-link"), {
              x: -20,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              delay: 0.4,
              ease: "elastic.out(1, 0.5)",
            });

            // Social icons animation
            gsap.from(links.querySelectorAll(".social-icon"), {
              scale: 0,
              rotation: 180,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              delay: 0.8,
              ease: "back.out(2)",
            });

            // Copyright animation
            gsap.from(copyright.children, {
              y: 30,
              opacity: 0,
              duration: 1,
              delay: 1.2,
              ease: "power3.out",
            });
          });
        },
        once: true,
      });

      return () => {
        Observer.getAll().forEach((observer) => observer.kill());
      };
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      ref={footerRef}
      className="py-16 bg-muted/50 border-t border-border relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Enhanced Logo Section */}
          <div ref={contentRef} className="space-y-6">
            <a href="#home" className="group inline-block">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Abhay
                <span className="ml-1.5 bg-gradient-to-r from-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                  Krishnan
                </span>
              </h2>
              <div className="h-[2px] bg-gradient-to-r from-primary to-transparent w-full mt-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </a>

            <p className="text-sm text-muted-foreground/90 max-w-md leading-relaxed">
              Crafting digital experiences with precision and passion.
              Specializing in
              <span className="text-primary font-medium">
                {" "}
                responsive design
              </span>
              ,
              <span className="text-primary font-medium">
                {" "}
                interactive features
              </span>
              , and
              <span className="text-primary font-medium">
                {" "}
                performance optimization
              </span>
              .
            </p>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center px-5 py-2.5 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/20"
              >
                <ArrowUp className="w-5 h-5 mr-2 text-primary group-hover:animate-float" />
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-medium">
                  Back to Summit
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Links Section */}
          <div ref={linksRef} className="space-y-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Navigation
            </h3>
            <nav className="grid grid-cols-2 gap-3">
              {[
                "Home",
                "About",
                "Skills",
                "Experience",
                "Projects",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="footer-link group flex items-center text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-300" />
                  {item}
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    →
                  </span>
                </a>
              ))}
            </nav>

            <div className="pt-6">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Connect With Me
              </h3>
              <div className="flex gap-3">
                {[
                  { icon: Github, color: "hover:bg-gray-800 hover:text-white" },
                  {
                    icon: Linkedin,
                    color: "hover:bg-blue-700 hover:text-white",
                  },
                  { icon: Twitter, color: "hover:bg-sky-500 hover:text-white" },
                  {
                    icon: Instagram,
                    color: "hover:bg-pink-600 hover:text-white",
                  },
                  { icon: Mail, color: "hover:bg-red-600 hover:text-white" },
                ].map(({ icon: Icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={cn(
                      "social-icon w-10 h-10 rounded-xl bg-background flex items-center justify-center",
                      "transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg",
                      color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Newsletter Section */}
          <div className="space-y-6">
            <FooterWeather />
          </div>
        </div>

        {/* Animated Copyright Section */}
        <div
          ref={copyrightRef}
          className="mt-16 pt-8 border-t border-border/50 text-center"
        >
          <p className="text-sm text-muted-foreground/80 mb-2">
            © {currentYear} Abhay Krishnan. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-4">
            <p className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer">
              Privacy Policy
            </p>
            <span className="text-muted-foreground/40">•</span>
            <p className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer">
              Terms of Service
            </p>
            <span className="text-muted-foreground/40">•</span>
            <p className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer">
              Cookies
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground/60">
              Crafted with <span className="text-red-500">❤️</span> using
              <span className="mx-2 px-2 py-1 bg-muted rounded-full text-primary font-medium">
                React
              </span>
              <span className="mx-2 px-2 py-1 bg-muted rounded-full text-primary font-medium">
                TypeScript
              </span>
              <span className="mx-2 px-2 py-1 bg-muted rounded-full text-primary font-medium">
                GSAP
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div
        ref={circlesRef}
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] pointer-events-none opacity-10"
      >
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-60 right-1/3 w-28 h-28 bg-primary/10 rounded-full blur-xl" />
      </div>

      {/* Particle Animation Container */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Chat Components */}
      <AichatBot />

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(10px) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(10px);
          }
        }

        @keyframes gradient-pulse {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
