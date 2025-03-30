"use client";

import { useState, useEffect, useRef } from "react";
import LightningBolts from "./LightningBolts";

interface HeroLightningEffectProps {
  enabled?: boolean;
  intensity?: "low" | "medium" | "high";
}

const HeroLightningEffect = ({
  enabled = true,
  intensity = "medium",
}: HeroLightningEffectProps) => {
  const [showLightning, setShowLightning] = useState(false);
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Configure timing based on intensity
    let minDelay: number, maxDelay: number;
    switch (intensity) {
      case "low":
        minDelay = 5000; // 5 seconds
        maxDelay = 15000; // 15 seconds
        break;
      case "high":
        minDelay = 2000; // 2 seconds
        maxDelay = 6000; // 6 seconds
        break;
      case "medium":
      default:
        minDelay = 3000; // 3 seconds
        maxDelay = 10000; // 10 seconds
        break;
    }

    // Function to trigger lightning
    const triggerLightning = () => {
      // First flash
      setShowLightning(true);

      // Hide first flash after a short duration
      setTimeout(() => {
        setShowLightning(false);

        // Sometimes add a second flash for realism
        if (Math.random() > 0.6) {
          setTimeout(() => {
            setShowLightning(true);
            setTimeout(() => {
              setShowLightning(false);
            }, 100);
          }, 150);
        }
      }, 200);

      // Schedule next lightning
      const nextLightningDelay =
        Math.random() * (maxDelay - minDelay) + minDelay;
      lightningTimeoutRef.current = setTimeout(
        triggerLightning,
        nextLightningDelay
      );
    };

    // Initial lightning after a delay
    lightningTimeoutRef.current = setTimeout(
      triggerLightning,
      Math.random() * (maxDelay - minDelay) + minDelay
    );

    return () => {
      if (lightningTimeoutRef.current) {
        clearTimeout(lightningTimeoutRef.current);
      }
    };
  }, [enabled, intensity]);

  if (!enabled) return null;

  return (
    <>
      <div
        className={`hero-lightning-flash ${showLightning ? "active" : ""}`}
      ></div>
      <LightningBolts enabled={enabled} intensity={intensity} />
    </>
  );
};

export default HeroLightningEffect;
