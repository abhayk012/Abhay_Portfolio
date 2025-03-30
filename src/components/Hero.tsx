"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "./theme-provider";
import HeroLightningEffect from "./HeroLightningEffect";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const Hero = () => {
  const { theme } = useTheme();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const snowRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const rainAudioRef = useRef<HTMLAudioElement>(null);
  const thunderAudioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const lightningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Handle sound effects
  useEffect(() => {
    const rainAudio = rainAudioRef.current;
    const thunderAudio = thunderAudioRef.current;

    if (rainAudio && thunderAudio) {
      // Set initial volume - increase the volume for better audibility
      rainAudio.volume = 0.3; // Reduced from 0.5
      thunderAudio.volume = 0.4; // Reduced from 0.6

      // Make sure the audio files are properly loaded
      rainAudio.load();
      thunderAudio.load();

      console.log("Rain audio loaded:", rainAudio.readyState);
      console.log("Thunder audio loaded:", thunderAudio.readyState);

      // Play/pause based on theme
      if (theme === "rain" && !isMuted) {
        // Use a promise to handle autoplay restrictions
        const playPromise = rainAudio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Rain audio playing successfully");
            })
            .catch((error) => {
              console.error("Audio play prevented:", error);
            });
        }

        thunderAudio.pause();
      } else if (theme === "snowfall" && !isMuted) {
        const playPromise = thunderAudio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Thunder audio playing successfully");
            })
            .catch((error) => {
              console.error("Audio play prevented:", error);
            });
        }

        rainAudio.pause();
      } else {
        rainAudio.pause();
        thunderAudio.pause();
      }
    }

    return () => {
      if (rainAudio) rainAudio.pause();
      if (thunderAudio) thunderAudio.pause();
    };
  }, [theme, isMuted]);

  // Theme-based animations
  useEffect(() => {
    if (loading) return;

    const sky = skyRef.current;
    const clouds = cloudsRef.current;
    const rain = rainRef.current;
    const snow = snowRef.current;
    const sun = sunRef.current;
    const moon = moonRef.current;
    const lightning = lightningRef.current;
    const heroCard = heroCardRef.current;
    const thunderAudio = thunderAudioRef.current;

    if (sky && clouds && rain && snow && sun && moon && lightning && heroCard) {
      // Reset all animations first
      gsap.killTweensOf([
        sky,
        clouds,
        rain,
        snow,
        sun,
        moon,
        lightning,
        heroCard,
      ]);

      // Clear any existing lightning interval
      if (lightningIntervalRef.current) {
        clearInterval(lightningIntervalRef.current);
        lightningIntervalRef.current = null;
      }

      // Hide rain and snow by default
      gsap.set(rain, { opacity: 0 });
      gsap.set(snow, { opacity: 0 });
      gsap.set(lightning, { opacity: 0 });

      // Set sky color based on theme
      if (theme === "light") {
        gsap.to(sky, {
          backgroundColor: "#87CEEB", // Sky Blue
          duration: 1.5,
          ease: "power2.inOut",
        });
      } else if (theme === "dark") {
        gsap.to(sky, {
          backgroundColor: "#0f172a", // Dark blue night sky
          duration: 1.5,
          ease: "power2.inOut",
        });
      } else if (theme === "rain") {
        gsap.to(sky, {
          backgroundColor: "#1e293b", // Darker blue for rainy sky
          duration: 1.5,
          ease: "power2.inOut",
        });
      } else if (theme === "snowfall") {
        gsap.to(sky, {
          backgroundColor: "#334155", // Dark gray-blue for snowy sky
          duration: 1.5,
          ease: "power2.inOut",
        });
      }

      // Sun/Moon animations based on theme
      if (theme === "light") {
        // Sun rises
        gsap.fromTo(
          sun,
          { y: 100, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
        );

        // Moon sets
        gsap.to(moon, {
          y: -100,
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });
      } else if (theme === "dark") {
        // Sun sets
        gsap.to(sun, {
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Moon rises
        gsap.fromTo(
          moon,
          { y: -100, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
        );
      } else if (theme === "snowfall") {
        // Sun peeks from behind clouds
        gsap.to(sun, {
          y: 0,
          x: -20,
          opacity: 0.8,
          scale: 0.9,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Moon hidden
        gsap.to(moon, {
          y: -100,
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }

      // Set cloud opacity and color based on theme
      if (theme === "light") {
        gsap.to(clouds, {
          opacity: 0.9,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Make clouds white
        document.querySelectorAll(".cloud-part").forEach((cloud) => {
          gsap.to(cloud, {
            backgroundColor: "white",
            duration: 1.5,
          });
        });
      } else if (theme === "dark") {
        gsap.to(clouds, {
          opacity: 0.5,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Make clouds dark gray
        document.querySelectorAll(".cloud-part").forEach((cloud) => {
          gsap.to(cloud, {
            backgroundColor: "#4b5563",
            duration: 1.5,
          });
        });
      } else if (theme === "rain") {
        gsap.to(clouds, {
          opacity: 0.8,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Make clouds dark gray
        document.querySelectorAll(".cloud-part").forEach((cloud) => {
          gsap.to(cloud, {
            backgroundColor: "#374151",
            duration: 1.5,
          });
        });
      } else if (theme === "snowfall") {
        gsap.to(clouds, {
          opacity: 0.9,
          duration: 1.5,
          ease: "power2.inOut",
        });

        // Make clouds dark gray with blue tint
        document.querySelectorAll(".cloud-part").forEach((cloud) => {
          gsap.to(cloud, {
            backgroundColor: "#475569",
            duration: 1.5,
          });
        });
      }

      // Animate clouds moving slowly
      const cloudElements = document.querySelectorAll(".cloud-icon");
      cloudElements.forEach((cloud, index) => {
        gsap.to(cloud, {
          x: index % 2 === 0 ? "+=50" : "-=50",
          y: index % 3 === 0 ? "+=10" : "-=10",
          duration: 20 + index * 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Rain animation
      if (theme === "rain") {
        gsap.to(rain, { opacity: 1, duration: 0.5 });

        // Create raindrops dynamically
        rain.innerHTML = ""; // Clear existing raindrops
        for (let i = 0; i < 100; i++) {
          const raindrop = document.createElement("div");
          raindrop.className =
            "raindrop absolute w-0.5 h-4 bg-blue-300 opacity-70";
          raindrop.style.left = `${Math.random() * 100}%`;
          raindrop.style.top = `-${Math.random() * 20}px`;
          rain.appendChild(raindrop);
        }

        const raindrops = rain.querySelectorAll(".raindrop");
        raindrops.forEach((drop) => {
          gsap.fromTo(
            drop,
            {
              y: -20,
              x: gsap.utils.random(-5, 5),
              opacity: gsap.utils.random(0.3, 1),
            },
            {
              y: "100vh",
              duration: gsap.utils.random(0.8, 1.5),
              repeat: -1,
              ease: "none",
              delay: gsap.utils.random(0, 1),
            }
          );
        });

        // Add wet text effect - dripping animation
        const heroText = document.querySelectorAll(".hero-text");
        heroText.forEach((text) => {
          // Add water droplet effect
          gsap.to(text, {
            textShadow:
              "0 0 5px rgba(0, 150, 255, 0.8), 0 0 10px rgba(0, 150, 255, 0.4)",
            color: "rgba(255, 255, 255, 0.9)",
            duration: 1,
          });

          // Create dripping effect
          const createDrip = () => {
            if (theme !== "rain") return;

            const drip = document.createElement("div");
            drip.className =
              "absolute w-1 bg-blue-300 opacity-70 rounded-b-full z-10";
            drip.style.left = `${gsap.utils.random(0, 100)}%`;
            drip.style.top = "100%";
            drip.style.height = "0";

            text.appendChild(drip);

            gsap.to(drip, {
              height: gsap.utils.random(10, 30),
              duration: gsap.utils.random(1, 2),
              ease: "power1.in",
              onComplete: () => {
                gsap.to(drip, {
                  opacity: 0,
                  duration: 0.5,
                  onComplete: () => {
                    if (drip.parentNode) {
                      drip.parentNode.removeChild(drip);
                    }
                  },
                });
              },
            });

            if (theme === "rain") {
              setTimeout(createDrip, gsap.utils.random(1000, 3000));
            }
          };

          createDrip();

          // Add lightning effect to rain theme
          const createRainLightning = () => {
            if (theme !== "rain") return;

            // Clear existing lightning bolts
            lightning.innerHTML = "";

            // Create multiple lightning bolts for a more dramatic effect
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                // Create a new lightning bolt
                const bolt = document.createElement("div");
                bolt.className = "lightning-bolt absolute text-7xl z-20";
                bolt.innerHTML = "⚡"; // Using innerHTML to ensure the emoji renders
                bolt.style.left = `${gsap.utils.random(10, 90)}%`;
                bolt.style.top = `${gsap.utils.random(10, 40)}%`;
                bolt.style.transform = `rotate(${gsap.utils.random(
                  -20,
                  20
                )}deg) scale(0)`;
                bolt.style.opacity = "0";
                bolt.style.fontSize = "7rem"; // Even larger size for better visibility
                bolt.style.filter =
                  "drop-shadow(0 0 30px rgba(255, 255, 255, 0.9))"; // Enhanced glow
                bolt.style.color = "#ffeb3b"; // Bright yellow

                lightning.appendChild(bolt);

                // Animate the lightning bolt with a more dramatic effect
                gsap.to(bolt, {
                  opacity: 1,
                  scale: 1.2,
                  duration: 0.1, // Faster appearance
                  ease: "power2.out",
                  onComplete: () => {
                    gsap.to(bolt, {
                      opacity: 0,
                      scale: 1.5,
                      duration: 0.4,
                      delay: 0.1,
                      ease: "power2.in",
                      onComplete: () => {
                        if (bolt.parentNode) {
                          bolt.parentNode.removeChild(bolt);
                        }
                      },
                    });
                  },
                });
              }, i * 100); // Stagger the lightning bolts
            }

            // Add a more dramatic flash to the sky
            gsap.to(sky, {
              backgroundColor: "rgba(255, 255, 255, 0.5)", // Brighter flash
              duration: 0.1,
              onComplete: () => {
                gsap.to(sky, {
                  backgroundColor: theme === "rain" ? "#1e293b" : "#334155",
                  duration: 0.3,
                });
              },
            });

            // Play thunder sound
            if (thunderAudio && !isMuted) {
              thunderAudio.currentTime = 0;
              thunderAudio
                .play()
                .catch((e) => console.log("Thunder audio play prevented:", e));
            }
          };

          // Trigger lightning immediately
          createRainLightning();

          // Set up interval for lightning
          if (lightningIntervalRef.current) {
            clearInterval(lightningIntervalRef.current);
          }
          lightningIntervalRef.current = setInterval(() => {
            createRainLightning();
          }, 3000); // Lightning every 3 seconds
        });
      }

      // Snow animation - only for snowfall theme
      if (theme === "snowfall") {
        gsap.to(snow, { opacity: 1, duration: 0.5 });

        // Create snowflakes dynamically
        snow.innerHTML = ""; // Clear existing snowflakes
        for (let i = 0; i < 100; i++) {
          const snowflake = document.createElement("div");
          snowflake.className =
            "snowflake absolute w-2 h-2 bg-white rounded-full opacity-80";
          snowflake.style.left = `${Math.random() * 100}%`;
          snowflake.style.top = `-${Math.random() * 20}px`;
          snowflake.style.boxShadow = "0 0 5px 2px rgba(255,255,255,0.3)";
          snow.appendChild(snowflake);
        }

        const snowflakes = snow.querySelectorAll(".snowflake");
        snowflakes.forEach((flake) => {
          gsap.fromTo(
            flake,
            {
              y: -20,
              x: gsap.utils.random(-10, 10),
              opacity: gsap.utils.random(0.5, 1),
              rotation: gsap.utils.random(0, 360),
            },
            {
              y: "100vh",
              x: `+=${gsap.utils.random(-100, 100)}`,
              rotation: "+=360",
              duration: gsap.utils.random(5, 10),
              repeat: -1,
              ease: "none",
              delay: gsap.utils.random(0, 3),
            }
          );
        });

        // Add snow on text effect
        const heroText = document.querySelectorAll(".hero-text");
        heroText.forEach((text) => {
          // Add frost effect
          gsap.to(text, {
            textShadow:
              "0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(200, 235, 255, 0.6)",
            color: "rgba(255, 255, 255, 0.95)",
            duration: 1,
          });

          // Create snow accumulation on text
          const createSnowOnText = () => {
            if (theme !== "snowfall") return;

            const snowPile = document.createElement("div");
            snowPile.className =
              "absolute bg-white opacity-80 rounded-full z-10";
            snowPile.style.left = `${gsap.utils.random(0, 100)}%`;
            snowPile.style.top = `${gsap.utils.random(-5, 0)}px`;
            snowPile.style.width = `${gsap.utils.random(3, 8)}px`;
            snowPile.style.height = `${gsap.utils.random(2, 4)}px`;

            text.appendChild(snowPile);

            gsap.to(snowPile, {
              opacity: 0,
              y: 5,
              duration: gsap.utils.random(3, 6),
              ease: "power1.in",
              onComplete: () => {
                if (snowPile.parentNode) {
                  snowPile.parentNode.removeChild(snowPile);
                }
              },
            });

            if (theme === "snowfall") {
              setTimeout(createSnowOnText, gsap.utils.random(500, 2000));
            }
          };

          createSnowOnText();
        });

        const createLightning = () => {
          if (theme !== "snowfall") return;

          // Clear existing lightning bolts
          lightning.innerHTML = "";

          // Create multiple lightning bolts for a more dramatic effect
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              // Create a new lightning bolt
              const bolt = document.createElement("div");
              bolt.className = "lightning-bolt absolute text-6xl z-20";
              bolt.innerHTML = "⚡"; // Using innerHTML to ensure the emoji renders
              bolt.style.left = `${gsap.utils.random(10, 90)}%`;
              bolt.style.top = `${gsap.utils.random(10, 40)}%`;
              bolt.style.transform = `rotate(${gsap.utils.random(
                -20,
                20
              )}deg) scale(0)`;
              bolt.style.opacity = "0";
              bolt.style.fontSize = "6rem"; // Larger size
              bolt.style.filter =
                "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))"; // Enhanced glow
              bolt.style.color = "#ffeb3b"; // Bright yellow

              lightning.appendChild(bolt);

              // Animate the lightning bolt with a more dramatic effect
              gsap.to(bolt, {
                opacity: 1,
                scale: 1.2,
                duration: 0.1, // Faster appearance
                ease: "power2.out",
                onComplete: () => {
                  gsap.to(bolt, {
                    opacity: 0,
                    scale: 1.5,
                    duration: 0.4,
                    delay: 0.1,
                    ease: "power2.in",
                    onComplete: () => {
                      if (bolt.parentNode) {
                        bolt.parentNode.removeChild(bolt);
                      }
                    },
                  });
                },
              });
            }, i * 100); // Stagger the lightning bolts
          }

          // Add a more dramatic flash to the sky
          gsap.to(sky, {
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Brighter flash
            duration: 0.1,
            onComplete: () => {
              gsap.to(sky, {
                backgroundColor: theme === "snowfall" ? "#334155" : "#1e293b",
                duration: 0.3,
              });
            },
          });

          // Play thunder sound
          if (thunderAudio && !isMuted) {
            thunderAudio.currentTime = 0;
            thunderAudio.volume = 0.7; // Increase volume
            thunderAudio
              .play()
              .catch((e) => console.log("Thunder audio play prevented:", e));
          }
        };

        // Trigger lightning immediately
        createLightning();

        // Set up interval for lightning
        lightningIntervalRef.current = setInterval(() => {
          createLightning();
        }, 2500); // Lightning more frequently
      }

      // Hero card hover effect
      gsap.to(heroCard, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      // Add floating animation to hero card
      gsap.to(heroCard, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    return () => {
      // Clean up animations
      if (sky && clouds && rain && snow && sun && moon && lightning) {
        gsap.killTweensOf([sky, clouds, rain, snow, sun, moon, lightning]);
      }

      // Clear lightning interval
      if (lightningIntervalRef.current) {
        clearInterval(lightningIntervalRef.current);
        lightningIntervalRef.current = null;
      }
    };
  }, [theme, loading, isMuted]);

  // Main text animations
  useEffect(() => {
    if (loading) return;

    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (title && subtitle) {
      // Text animation with TextPlugin
      gsap.to(title, {
        text: "Hi, I'm Abhay Krishnan",
        duration: 2,
        ease: "none",
      });

      gsap.to(title, {
        opacity: 1,
        duration: 0.5,
        scale: 1.05,
      });

      // Subtitle animation starts after title
      gsap.delayedCall(1, () => {
        gsap.to(subtitle, {
          text: "Front-End Web Developer",
          duration: 1.5,
          ease: "none",
        });

        gsap.to(subtitle, {
          opacity: 1,
          duration: 0.5,
          scale: 1.05,
        });
      });
    }

    return () => {
      gsap.killTweensOf([title, subtitle]);
    };
  }, [loading]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Function to enable audio on first user interaction
  const enableAudio = () => {
    const rainAudio = rainAudioRef.current;
    const thunderAudio = thunderAudioRef.current;

    if (rainAudio && thunderAudio) {
      // Just trigger a play and immediate pause to enable audio
      rainAudio
        .play()
        .then(() => {
          if (theme !== "rain" || isMuted) {
            rainAudio.pause();
          }
        })
        .catch((e) => console.log("Could not enable rain audio:", e));

      thunderAudio
        .play()
        .then(() => {
          if (theme !== "snowfall" || isMuted) {
            thunderAudio.pause();
          }
        })
        .catch((e) => console.log("Could not enable thunder audio:", e));
    }
  };
const showLightning = theme === "rain" 
  // Enable audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      enableAudio();
      // Remove the event listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-primary border-solid rounded-full animate-spin"></div>
          <div className="absolute w-full h-full border-4 border-secondary border-solid rounded-full border-t-transparent animate-spin reverse"></div>
        </div>
        <div className="text-xl font-bold text-primary mt-4 animate-pulse">
          Loading Portfolio...
        </div>
      </div>
    );
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      data-speed="1.1"
    >
      {/* Audio elements with better sources */}
      <audio ref={rainAudioRef} loop preload="auto">
        <source src="/sounds/rain.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={thunderAudioRef} preload="auto">
        <source src="/sounds/thunder.mp3" type="audio/mpeg" />
      </audio>

      {/* Sound toggle button */}
      {(theme === "rain" || theme === "snowfall") && (
        <div className="absolute top-24 right-6 z-50 flex flex-col gap-2">
          <button
            onClick={toggleMute}
            className="bg-background/30 backdrop-blur-sm p-2 rounded-full hover:bg-background/50 transition-all duration-300"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          {/* <button
            onClick={enableAudio}
            className="bg-background/30 backdrop-blur-sm p-2 rounded-full hover:bg-background/50 transition-all duration-300"
            aria-label="Enable Audio"
            title="Click to enable audio"
          >
            <Volume2 size={20} className="text-green-500" />
          </button> */}
        </div>
      )}

      {/* Sky Background */}
      <div
        ref={skyRef}
        className="absolute inset-0 transition-colors duration-1000 hardware-accelerated"
        style={{
          backgroundColor:
            theme === "light"
              ? "#87CEEB"
              : theme === "dark"
              ? "#0f172a"
              : theme === "rain"
              ? "#1e293b"
              : "#334155",
        }}
      />

      {/* Weather Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun */}
        <div
          ref={sunRef}
          className="absolute top-20 right-20 w-32 h-32 rounded-full hardware-accelerated"
          style={{
            backgroundColor: "#FFD700", // Gold
            boxShadow: "0 0 70px 15px rgba(255,215,0,0.7)",
            opacity: theme === "light" ? 1 : theme === "snowfall" ? 0.8 : 0,
            transform: `translate(${theme === "snowfall" ? "-20px" : "0px"}, ${
              theme === "light" || theme === "snowfall" ? "0px" : "100px"
            })`,
          }}
        />

        {/* Moon */}
        <div
          ref={moonRef}
          className="absolute top-20 right-20 w-24 h-24 rounded-full hardware-accelerated"
          style={{
            backgroundColor: "#E1E1E1", // Light Gray
            boxShadow: "0 0 50px 10px rgba(225,225,225,0.5)",
            opacity: theme === "dark" || theme === "rain" ? 1 : 0,
            transform: `translateY(${
              theme === "dark" || theme === "rain" ? "0px" : "-100px"
            })`,
          }}
        >
          <div className="absolute top-4 right-4 w-6 h-6 bg-gray-300 rounded-full opacity-80"></div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-gray-300 rounded-full opacity-60"></div>
        </div>

        {/* Clouds */}
        <div
          ref={cloudsRef}
          className="absolute inset-0"
          style={{
            opacity:
              theme === "light"
                ? 0.9
                : theme === "dark"
                ? 0.5
                : theme === "rain"
                ? 0.8
                : 0.9,
          }}
        >
          {/* Cloud 1 */}
          <div className="cloud-icon absolute top-10 left-1/4 hardware-accelerated">
            <div className="relative">
              <div className="cloud-part w-24 h-8 rounded-full"></div>
              <div className="cloud-part absolute top-[-12px] left-4 w-12 h-12 rounded-full"></div>
              <div className="cloud-part absolute top-[-8px] left-14 w-10 h-10 rounded-full"></div>
            </div>
          </div>

          {/* Cloud 2 */}
          <div className="cloud-icon absolute top-40 left-2/3 hardware-accelerated">
            <div className="relative">
              <div className="cloud-part w-32 h-10 rounded-full"></div>
              <div className="cloud-part absolute top-[-16px] left-6 w-16 h-16 rounded-full"></div>
              <div className="cloud-part absolute top-[-12px] left-20 w-14 h-14 rounded-full"></div>
            </div>
          </div>

          {/* Cloud 3 */}
          <div className="cloud-icon absolute top-60 left-1/5 hardware-accelerated">
            <div className="relative">
              <div className="cloud-part w-20 h-6 rounded-full"></div>
              <div className="cloud-part absolute top-[-10px] left-3 w-10 h-10 rounded-full"></div>
              <div className="cloud-part absolute top-[-6px] left-12 w-8 h-8 rounded-full"></div>
            </div>
          </div>

          {/* Cloud 4 */}
          <div className="cloud-icon absolute top-20 left-3/4 hardware-accelerated">
            <div className="relative">
              <div className="cloud-part w-28 h-9 rounded-full"></div>
              <div className="cloud-part absolute top-[-14px] left-5 w-14 h-14 rounded-full"></div>
              <div className="cloud-part absolute top-[-10px] left-18 w-12 h-12 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Lightning Effect Container */}
        <div
          ref={lightningRef}
          className="absolute inset-0 z-10 pointer-events-none"
        ></div>

        {/* Rain Animation */}
        <div
          ref={rainRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: theme === "rain" ? 1 : 0 }}
        >
          {/* Raindrops are created dynamically in the useEffect */}
        </div>

        {/* Snow Animation */}
        <div
          ref={snowRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: theme === "snowfall" ? 1 : 0 }}
        >
          {/* Snowflakes are created dynamically in the useEffect */}
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div
          ref={heroCardRef}
          className="max-w-3xl mx-auto text-center bg-background/30 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-500 hover:shadow-xl opacity-0 translate-y-10"
        >
          <h1
            ref={titleRef}
            className="hero-text text-4xl md:text-6xl font-bold mb-4 text-black dark:text-white opacity-0 cursor-pointer relative transition-transform duration-300 hover:scale-110 hover-highlight"
          ></h1>

          <h2
            ref={subtitleRef}
            className="hero-text text-2xl md:text-3xl font-semibold text-primary opacity-0 mb-6 cursor-pointer transition-transform duration-300 hover:scale-110 hover-highlight"
          ></h2>

          <p className="hero-text text-lg mb-8 text-black dark:text-white hover-highlight">
            THIS IS MY OFFICIAL PORTFOLIO WEBSITE TO DESCRIBE ALL DETAILS AND
            WORK EXPERIENCE IN WEB DEVELOPMENT.
          </p>

          <div className="flex justify-center space-x-4 mt-6">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 bg-primary rounded-full shadow-lg hover:bg-primary/80 transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse ${
                theme === "dark" || theme === "rain"
                  ? "text-black"
                  : "text-white"
              }`}
            >
              DOWNLOAD CV
            </a>
            <a
              href="#projects"
              className="px-8 py-4 border-2 border-primary text-primary rounded-full shadow-lg hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse"
            >
              View Projects
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#about"
          aria-label="Scroll down"
          className="hover:text-primary transition-colors duration-300"
        >
          <ArrowDown className="h-8 w-8 text-primary animate-pulse" />
        </a>
      </div>
      {showLightning && <HeroLightningEffect intensity={theme === "rain" ? "high" : "medium"} />}
    </section>
  );
};

export default Hero;
