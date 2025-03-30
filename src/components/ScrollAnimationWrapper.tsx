"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  animation?: "fade" | "slide" | "scale" | "reveal" | "stagger";
  delay?: number;
  duration?: number;
  threshold?: number;
  markers?: boolean;
  pin?: boolean;
  pinSpacing?: boolean;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  dataSpeed?: string;
}

const ScrollAnimationWrapper = ({
  children,
  id,
  className = "",
  animation = "fade",
  delay = 0,
  duration = 1,
  threshold = 0.2,
  markers = false,
  pin = false,
  pinSpacing = false,
  scrub = false,
  start = "top 80%",
  end = "bottom 20%",
  dataSpeed,
  ...props
}: ScrollAnimationWrapperProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const childrenContainer = childrenRef.current;

    if (!section || !childrenContainer) return;

    // Make sure content is visible initially
    gsap.set(childrenContainer, { opacity: 1, visibility: "visible" });

    // Initial state based on animation type
    let initialState = {};
    let animationState = {};

    switch (animation) {
      case "fade":
        initialState = { opacity: 0, y: 30 };
        animationState = { opacity: 1, y: 0 };
        break;
      case "slide":
        initialState = { x: -100, opacity: 0 };
        animationState = { x: 0, opacity: 1 };
        break;
      case "scale":
        initialState = { scale: 0.8, opacity: 0 };
        animationState = { scale: 1, opacity: 1 };
        break;
      case "reveal":
        // For reveal, we'll use a simpler approach
        gsap.set(childrenContainer, { opacity: 0, y: 30 });

        gsap.to(childrenContainer, {
          opacity: 1,
          y: 0,
          duration: duration,
          ease: "power2.out",
          delay: delay,
          scrollTrigger: {
            trigger: section,
            start: start,
            end: end,
            markers: markers,
            toggleActions: "play none none reverse",
          },
        });

        return () => {
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.vars.trigger === section) {
              trigger.kill();
            }
          });
        };
      case "stagger":
        // For stagger, we'll animate each child element separately
        gsap.set(childrenContainer.children, { opacity: 0, y: 30 });

        gsap.to(childrenContainer.children, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: duration,
          ease: "power2.out",
          delay: delay,
          scrollTrigger: {
            trigger: section,
            start: start,
            end: end,
            markers: markers,
            toggleActions: "play none none reverse",
          },
        });

        return () => {
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.vars.trigger === section) {
              trigger.kill();
            }
          });
        };
      default:
        initialState = { opacity: 0 };
        animationState = { opacity: 1 };
    }

    // Set initial state
    gsap.set(childrenContainer, initialState);

    // Create the animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: start,
        end: end,
        markers: markers,
        pin: pin,
        pinSpacing: pinSpacing,
        scrub: scrub,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(childrenContainer, {
      ...animationState,
      duration: duration,
      ease: "power2.out",
      delay: delay,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [animation, delay, duration, end, markers, pin, pinSpacing, scrub, start]);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`scroll-animation-wrapper ${className}`}
      data-speed={dataSpeed}
      {...props}
    >
      <div ref={childrenRef} className="scroll-animation-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollAnimationWrapper;
