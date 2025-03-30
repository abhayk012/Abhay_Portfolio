"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeading = ({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;

    if (heading) {
      // Make sure heading is visible initially
      gsap.set(heading, { opacity: 1, visibility: "visible" });
      gsap.set(heading.querySelector(".main-title"), {
        opacity: 1,
        visibility: "visible",
      });
      gsap.set(heading.querySelector(".decorative-line"), {
        opacity: 1,
        visibility: "visible",
      });
      if (subtitle) {
        gsap.set(heading.querySelector(".subtitle"), {
          opacity: 1,
          visibility: "visible",
        });
      }
      gsap.set(heading.querySelectorAll(".decorative-dot"), {
        opacity: 1,
        visibility: "visible",
      });

      // Create timeline for heading animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate main title
      tl.from(heading.querySelector(".main-title"), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Animate decorative line
      tl.from(
        heading.querySelector(".decorative-line"),
        {
          width: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.3"
      );

      // Animate subtitle if it exists
      if (subtitle) {
        tl.from(
          heading.querySelector(".subtitle"),
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      // Animate decorative elements
      tl.from(
        heading.querySelectorAll(".decorative-dot"),
        {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      );

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      };
    }
  }, [subtitle]);

  const alignClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div
      ref={headingRef}
      className={`mb-16 relative ${alignClass[align]} ${className}`}
    >
      <h2 className="main-title text-3xl md:text-4xl font-bold relative inline-block">
        {title}
        <span className="absolute -top-1 -right-2 text-primary text-5xl opacity-10">
          {title.charAt(0)}
        </span>
      </h2>

      <div className="flex items-center justify-center mt-4">
        <span className="decorative-dot w-2 h-2 rounded-full bg-primary/70"></span>
        <span className="decorative-line block w-20 h-1 bg-primary mx-2"></span>
        <span className="decorative-dot w-2 h-2 rounded-full bg-primary/70"></span>
      </div>

      {subtitle && (
        <p className="subtitle text-muted-foreground mt-4 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
