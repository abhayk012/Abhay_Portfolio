"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { Wand2, Gamepad2, Mic, Sparkles, Share2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import DualChat from "./DualChat";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

// Racing game types
interface RacingObstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "car" | "oil" | "cone";
  speed: number;
}

interface RacingCoin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

interface PlayerCar {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lane: number;
}

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

const FunActivity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggableItemsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("drag");
  // State variables for active features only
  const [gameScore, setGameScore] = useState(0);
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; color: string; speed: number }>
  >([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [particlesArray, setParticlesArray] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      opacity: number;
      scale: number;
      duration: number;
    }>
  >([]);
  const [particleMode, setParticleMode] = useState<"attract" | "repel">(
    "attract"
  );
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const [particleCount, setParticleCount] = useState(0);

  // Racing game state
  const [isRaceActive, setIsRaceActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerCar, setPlayerCar] = useState<PlayerCar>({
    x: 0,
    y: 0,
    width: 40,
    height: 70,
    speed: 5,
    lane: 1,
  });
  const [obstacles, setObstacles] = useState<RacingObstacle[]>([]);
  const [coins, setCoins] = useState<RacingCoin[]>([]);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const gameLoopRef = useRef<number | null>(null);
  const raceContainerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [keyStates, setKeyStates] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  });
  const [showControls, setShowControls] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(0);
  const [isInvincible, setIsInvincible] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const draggableItems = draggableItemsRef.current;

    if (section && container && draggableItems) {
      // Create ScrollTrigger for the section
      const sectionTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        onEnter: () => {
          // Animate section entrance
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 1)",
            duration: 0.8,
            ease: "power2.inOut",
          });
          setIsVisible(true);
        },
        onLeave: () => {
          // Animate section exit
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 0.5)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          // Animate section re-entrance
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 1)",
            duration: 0.8,
            ease: "power2.inOut",
          });
          setIsVisible(true);
        },
        onLeaveBack: () => {
          // Animate section exit from top
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 0.5)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
      });

      // Initialize draggable elements when section becomes visible
      if (isVisible && activeTab === "drag") {
        const items = draggableItems.querySelectorAll(".draggable-item");

        items.forEach((item) => {
          // Create draggable instance for each item
          Draggable.create(item, {
            type: "x,y",
            bounds: container,
            edgeResistance: 0.65,
            throwProps: true,
            inertia: true,
            onDragStart: function (this: any) {
              gsap.to(this.target, {
                scale: 1.1,
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                duration: 0.2,
              });
            },
            onDragEnd: function (this: any) {
              gsap.to(this.target, {
                scale: 1,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                duration: 0.2,
              });
            },
            onPress: function (this: any) {
              // Bring to front
              gsap.set(this.target, { zIndex: 100 });
              gsap.to(this.target, {
                scale: 1.05,
                duration: 0.2,
              });
            },
            onRelease: function (this: any) {
              gsap.to(this.target, {
                scale: 1,
                duration: 0.2,
                delay: 0.2,
              });
              gsap.set(this.target, { zIndex: 10, delay: 0.5 });
            },
          });
        });

        // Add rotation animation to draggable items
        gsap.to(".draggable-item", {
          rotation: "+=360",
          duration: 20,
          repeat: -1,
          ease: "linear",
          stagger: 2,
        });
      }

      // Initialize morphing animations if on morph tab
      if (activeTab === "morph") {
        initMorphAnimations();
      }

      return () => {
        // Clean up
        sectionTrigger.kill();

        // Kill all draggable instances
        const draggables = Draggable.get(".draggable-item");
        if (draggables) {
          if (Array.isArray(draggables)) {
            draggables.forEach((drag) => drag.kill());
          } else {
            draggables.kill();
          }
        }
      };
    }
  }, [isVisible, activeTab]);

  // Initialize canvas for drawing
  useEffect(() => {
    if (activeTab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas size to match container
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Set up drawing style
        context.lineJoin = "round";
        context.lineCap = "round";
        context.lineWidth = 3;
        context.strokeStyle = "#000000"; // Black color for drawing

        contextRef.current = context;
      }
    }

    return () => {
      // Clear canvas when unmounting
      if (contextRef.current && canvasRef.current) {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };
  }, [activeTab]);

  // Set up voice recognition
  useEffect(() => {
    if (
      activeTab === "voice" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setVoiceText(transcript);

          // Generate particles based on voice input
          generateParticlesFromVoice(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [activeTab]);

  // Racing game initialization
  useEffect(() => {
    if (activeTab === "game" && raceContainerRef.current) {
      const container = raceContainerRef.current;
      const { width, height } = container.getBoundingClientRect();
      setContainerDimensions({ width, height });

      // Initialize player car position
      setPlayerCar((prev) => ({
        ...prev,
        x: width / 2 - 20,
        y: height - 100,
        width: 40,
        height: 70,
      }));

      // Set up keyboard event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          setKeyStates((prev) => ({ ...prev, [e.key]: true }));
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          setKeyStates((prev) => ({ ...prev, [e.key]: false }));
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [activeTab]);

  // Racing game loop
  useEffect(() => {
    if (isRaceActive && !isGameOver) {
      const gameLoop = () => {
        // Update player position based on key states
        setPlayerCar((prev) => {
          let newX = prev.x;
          let newY = prev.y;
          const moveSpeed = prev.speed + speedBoost;

          if (keyStates.ArrowLeft) newX = Math.max(10, prev.x - moveSpeed);
          if (keyStates.ArrowRight)
            newX = Math.min(
              containerDimensions.width - prev.width - 10,
              prev.x + moveSpeed
            );
          if (keyStates.ArrowUp) newY = Math.max(10, prev.y - moveSpeed);
          if (keyStates.ArrowDown)
            newY = Math.min(
              containerDimensions.height - prev.height - 10,
              prev.y + moveSpeed
            );

          // Determine lane
          const laneWidth = containerDimensions.width / 3;
          let lane = 1;
          if (newX < laneWidth) lane = 0;
          else if (newX > laneWidth * 2) lane = 2;

          return { ...prev, x: newX, y: newY, lane };
        });

        // Update obstacles
        setObstacles((prev) => {
          // Move existing obstacles down
          const updatedObstacles = prev
            .map((obstacle) => ({
              ...obstacle,
              y: obstacle.y + obstacle.speed,
            }))
            .filter((obstacle) => obstacle.y < containerDimensions.height + 50);

          // Randomly add new obstacles
          if (Math.random() < 0.02 + level * 0.005) {
            const laneWidth = containerDimensions.width / 3;
            const lane = Math.floor(Math.random() * 3);
            const obstacleTypes = ["car", "oil", "cone"];
            const type = obstacleTypes[
              Math.floor(Math.random() * obstacleTypes.length)
            ] as "car" | "oil" | "cone";

            let width = 40;
            let height = 70;

            if (type === "oil") {
              width = 50;
              height = 50;
            } else if (type === "cone") {
              width = 30;
              height = 30;
            }

            updatedObstacles.push({
              id: `obstacle-${Date.now()}-${Math.random()}`,
              x: lane * laneWidth + laneWidth / 2 - width / 2,
              y: -height,
              width,
              height,
              type,
              speed: 3 + Math.random() * 2 + level,
            });
          }

          return updatedObstacles;
        });

        // Update coins
        setCoins((prev) => {
          // Move existing coins down
          const updatedCoins = prev
            .map((coin) => ({
              ...coin,
              y: coin.y + 3,
            }))
            .filter(
              (coin) =>
                coin.y < containerDimensions.height + 30 && !coin.collected
            );

          // Randomly add new coins
          if (Math.random() < 0.01 + level * 0.002) {
            const laneWidth = containerDimensions.width / 3;
            const lane = Math.floor(Math.random() * 3);

            updatedCoins.push({
              id: `coin-${Date.now()}-${Math.random()}`,
              x: lane * laneWidth + laneWidth / 2 - 15,
              y: -30,
              collected: false,
            });
          }

          return updatedCoins;
        });

        // Check collisions
        if (!isInvincible) {
          obstacles.forEach((obstacle) => {
            if (checkCollision(playerCar, obstacle)) {
              if (obstacle.type === "oil") {
                // Oil slick makes controls temporarily reversed
                setKeyStates((prev) => ({
                  ArrowLeft: prev.ArrowRight,
                  ArrowRight: prev.ArrowLeft,
                  ArrowUp: prev.ArrowDown,
                  ArrowDown: prev.ArrowUp,
                }));

                // Remove the oil slick
                setObstacles((prev) =>
                  prev.filter((o) => o.id !== obstacle.id)
                );

                // Reset controls after 2 seconds
                setTimeout(() => {
                  setKeyStates({
                    ArrowLeft: false,
                    ArrowRight: false,
                    ArrowUp: false,
                    ArrowDown: false,
                  });
                }, 2000);
              } else {
                // Car or cone collision
                setLives((prev) => prev - 1);
                setIsInvincible(true);

                // Show explosion
                setShowExplosion(true);
                setExplosionPosition({ x: playerCar.x, y: playerCar.y });

                // Remove the obstacle
                setObstacles((prev) =>
                  prev.filter((o) => o.id !== obstacle.id)
                );

                // Hide explosion after animation
                setTimeout(() => {
                  setShowExplosion(false);
                }, 500);

                // Reset invincibility after 1.5 seconds
                setTimeout(() => {
                  setIsInvincible(false);
                }, 1500);
              }
            }
          });
        }

        // Check coin collection
        coins.forEach((coin) => {
          if (!coin.collected && checkCoinCollision(playerCar, coin)) {
            // Collect coin
            setCoins((prev) =>
              prev.map((c) =>
                c.id === coin.id ? { ...c, collected: true } : c
              )
            );

            // Increase score
            setGameScore((prev) => prev + 10);

            // Random chance for speed boost
            if (Math.random() < 0.3) {
              setSpeedBoost(3);
              setTimeout(() => setSpeedBoost(0), 3000);
            }
          }
        });

        // Update distance and level
        setDistance((prev) => {
          const newDistance = prev + 1;

          // Level up every 1000 distance
          if (newDistance % 1000 === 0) {
            setLevel((prevLevel) => prevLevel + 1);
          }

          return newDistance;
        });

        // Check game over
        if (lives <= 0) {
          setIsGameOver(true);
          setIsRaceActive(false);

          // Update high score
          if (gameScore > highScore) {
            setHighScore(gameScore);
          }

          return;
        }

        // Continue game loop
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [
    isRaceActive,
    isGameOver,
    keyStates,
    playerCar,
    obstacles,
    coins,
    containerDimensions,
    lives,
    level,
    speedBoost,
    isInvincible,
    gameScore,
    highScore,
  ]);

  // Collision detection helpers
  const checkCollision = (player: PlayerCar, obstacle: RacingObstacle) => {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  };

  const checkCoinCollision = (player: PlayerCar, coin: RacingCoin) => {
    const coinSize = 30;
    return (
      player.x < coin.x + coinSize &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coinSize &&
      player.y + player.height > coin.y
    );
  };

  // Start racing game
  const startRace = () => {
    setIsRaceActive(true);
    setIsGameOver(false);
    setGameScore(0);
    setDistance(0);
    setLives(3);
    setLevel(1);
    setObstacles([]);
    setCoins([]);
    setSpeedBoost(0);
    setIsInvincible(false);

    // Reset player position
    if (raceContainerRef.current) {
      const { width, height } =
        raceContainerRef.current.getBoundingClientRect();
      setPlayerCar((prev) => ({
        ...prev,
        x: width / 2 - 20,
        y: height - 100,
        lane: 1,
      }));
    }
  };

  // Function to initialize morphing animations
  const initMorphAnimations = () => {
    const morphElements = document.querySelectorAll(".morph-element");
    if (morphElements.length === 0) return;

    // Create timeline for morphing animations
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Animate the blob shape
    tl.to("#morph-path", {
      attr: {
        d: "M150,50 C200,50 250,100 250,150 C250,200 200,250 150,250 C100,250 50,200 50,150 C50,100 100,50 150,50 Z",
      },
      fill: "#8b5cf6",
      duration: 3,
      ease: "sine.inOut",
    });

    // Animate the circle
    tl.to(
      "#morph-circle",
      {
        attr: { cx: "180", cy: "120", r: "40" },
        fill: "#f43f5e",
        duration: 2,
        ease: "back.inOut(1.7)",
      },
      "-=2"
    );

    // Animate the rectangle
    tl.to(
      "#morph-rect",
      {
        attr: { x: "100", y: "180", width: "70", height: "30" },
        fill: "#10b981",
        rotation: 45,
        transformOrigin: "center",
        duration: 2.5,
        ease: "elastic.out(1, 0.3)",
      },
      "-=2.5"
    );
  };

  // Function to handle particle interaction on mouse move
  const handleParticleInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!particleContainerRef.current) return;

    const rect = particleContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createParticlesAt(x, y, 2); // Create 2 particles per move
  };

  // Function to handle particle interaction on touch
  const handleParticleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!particleContainerRef.current) return;

    const rect = particleContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    createParticlesAt(x, y, 3); // Create 3 particles per touch move
  };

  // Function to trigger a particle explosion
  const triggerParticleExplosion = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!particleContainerRef.current) return;

    const rect = particleContainerRef.current.getBoundingClientRect();
    let x, y;

    if ("clientX" in e) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }

    createParticlesAt(x, y, 30); // Create explosion with 30 particles
  };

  // Function to create particles at a specific position
  const createParticlesAt = (x: number, y: number, count: number) => {
    if (!particleContainerRef.current) return;

    const rect = particleContainerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const colors = [
      "#FF5E5B",
      "#D8D8D8",
      "#FFFFEA",
      "#00CECB",
      "#FFED66",
      "#3FA7D6",
      "#59CD90",
      "#FAC05E",
      "#EE6352",
      "#9370DB",
    ];

    const newParticles: Array<{
      id: number;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      opacity: number;
      scale: number;
      duration: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      // Each particle gets a unique ID to help React with keys
      const id = particleCount + i;

      // Random particle properties
      const size = Math.random() * 15 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100 + 50;
      const duration = Math.random() * 2 + 1;
      const scale = Math.random() * 0.5 + 0.2;

      // Calculate target position based on mode (attract or repel)
      let targetX, targetY;

      if (particleMode === "attract") {
        // In attract mode, particles move toward center
        targetX = containerWidth / 2 + Math.cos(angle) * (Math.random() * 20);
        targetY = containerHeight / 2 + Math.sin(angle) * (Math.random() * 20);
      } else {
        // In repel mode, particles move away from cursor
        targetX = x + Math.cos(angle) * distance * 2;
        targetY = y + Math.sin(angle) * distance * 2;
      }

      newParticles.push({
        id,
        x,
        y,
        targetX,
        targetY,
        size,
        color,
        opacity: 0.8,
        scale,
        duration,
      });
    }

    setParticleCount(particleCount + count);
    setParticlesArray((prev) => [...prev, ...newParticles].slice(-200)); // Limit to 200 particles
  };

  // Function to reset particles
  const resetParticles = () => {
    setParticlesArray([]);
  };

  // Voice handlers
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceText("");
      setParticles([]);
    }
  };

  const generateParticlesFromVoice = (text: string) => {
    // Generate particles based on text length and content
    const newParticles = [];
    const colors = ["#3b82f6", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"];

    for (let i = 0; i < text.length * 2; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 0.5,
      });
    }

    setParticles(newParticles);
  };

  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setGameScore(0);
    setVoiceText("");
    setParticles([]);

    // Clean up racing game
    if (activeTab === "game") {
      setIsRaceActive(false);
      setIsGameOver(false);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    // Initialize specific tab functionality
    if (tab === "morph") {
      setTimeout(initMorphAnimations, 100);
    }
  };

  // Touch controls for racing game
  const handleTouchControl = (direction: "left" | "right" | "up" | "down") => {
    const directionMap = {
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp",
      down: "ArrowDown",
    };

    setKeyStates((prev) => ({
      ...prev,
      [directionMap[direction]]: true,
    }));

    // Reset after a short delay
    setTimeout(() => {
      setKeyStates((prev) => ({
        ...prev,
        [directionMap[direction]]: false,
      }));
    }, 100);
  };

  return (
    <section
      id="fun"
      ref={sectionRef}
      className="py-20 overflow-hidden transition-colors duration-500"
      data-speed="1.02"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper animation="reveal" duration={0.8}>
          <SectionHeading
            title="Interactive Playground"
            subtitle="Take a break and play with these interactive activities powered by modern web technologies"
          />
        </ScrollAnimationWrapper>

        {/* Tabs */}
        <ScrollAnimationWrapper animation="fade" duration={0.8} delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => handleTabChange("drag")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "drag"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Drag & Drop
            </button>
            <button
              onClick={() => handleTabChange("morph")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "morph"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Wand2 className="w-4 h-4 mr-1" />
              Shape Morph
            </button>
            <button
              onClick={() => handleTabChange("particles")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "particles"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Particle Playground
            </button>
            <button
              onClick={() => handleTabChange("game")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "game"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Gamepad2 className="w-4 h-4 mr-1" />
              Mini Game
            </button>
            <button
              onClick={() => handleTabChange("voice")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "voice"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Mic className="w-4 h-4 mr-1" />
              Voice Magic
            </button>
            <button
              onClick={() => handleTabChange("socket")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === "socket"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Dual Chat
            </button>
          </div>
        </ScrollAnimationWrapper>

        {/* Animation container */}
        <ScrollAnimationWrapper animation="scale" duration={1} delay={0.4}>
          <div
            ref={containerRef}
            className={`relative h-[400px] md:h-[500px] bg-muted/30 rounded-xl overflow-hidden border border-border shadow-inner transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Instructions */}
            <div className="absolute top-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm z-20 text-center">
              {activeTab === "drag" && (
                <p className="text-sm">
                  Drag and throw the colorful shapes around! They'll bounce off
                  the edges.
                </p>
              )}
              {activeTab === "morph" && (
                <p className="text-sm">
                  Watch the shapes morph and transform with GSAP animations.
                </p>
              )}
              {activeTab === "particles" && (
                <p className="text-sm">
                  Move cursor or touch to create particles • Click/tap for
                  explosion
                </p>
              )}
              {/* Update the instructions for the game tab */}
              {activeTab === "game" && (
                <p className="text-sm">
                  Race your car and avoid obstacles! Use arrow keys to move.
                  Collect coins for points.
                </p>
              )}
              {activeTab === "voice" && (
                <p className="text-sm">
                  Click the microphone and speak to create colorful particle
                  effects!
                </p>
              )}
              {activeTab === "socket" && (
                <p className="text-sm">
                  Chat in real-time between two users! Messages are delivered
                  instantly via Socket.IO.
                </p>
              )}
            </div>

            {/* Draggable Items */}
            {activeTab === "drag" && (
              <div ref={draggableItemsRef} className="w-full h-full">
                <div className="draggable-item absolute top-1/4 left-1/4 w-20 h-20 bg-blue-500 rounded-full shadow-md cursor-grab active:cursor-grabbing"></div>
                <div className="draggable-item absolute top-1/3 left-1/2 w-24 h-24 bg-green-500 rounded-md shadow-md cursor-grab active:cursor-grabbing"></div>
                <div className="draggable-item absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-500 rounded-lg shadow-md cursor-grab active:cursor-grabbing"></div>
                <div className="draggable-item absolute top-2/3 left-2/3 w-20 h-20 bg-purple-500 rounded-full shadow-md cursor-grab active:cursor-grabbing"></div>
                <div className="draggable-item absolute top-1/2 left-2/3 w-28 h-28 bg-pink-500 rounded-md shadow-md cursor-grab active:cursor-grabbing transform rotate-45"></div>
              </div>
            )}

            {/* Morphing Shapes */}
            {activeTab === "morph" && (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="morph-svg"
                >
                  <path
                    id="morph-path"
                    d="M150,50 C150,50 200,75 200,150 C200,225 150,250 150,250 C150,250 100,225 100,150 C100,75 150,50 150,50 Z"
                    fill="#4f46e5"
                    className="morph-element"
                  />
                  <circle
                    id="morph-circle"
                    cx="150"
                    cy="150"
                    r="50"
                    fill="#ec4899"
                    className="morph-element"
                  />
                  <rect
                    id="morph-rect"
                    x="125"
                    y="125"
                    width="50"
                    height="50"
                    fill="#eab308"
                    className="morph-element"
                  />
                </svg>
              </div>
            )}

            {/* Particle Playground */}
            {activeTab === "particles" && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
                <div
                  ref={particleContainerRef}
                  className="relative w-full h-[90%] bg-black rounded-lg shadow-inner overflow-hidden"
                >
                  {particlesArray.map((particle, index) => (
                    <motion.div
                      key={index}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        backgroundColor: particle.color,
                        width: particle.size,
                        height: particle.size,
                        x: particle.x,
                        y: particle.y,
                        opacity: particle.opacity,
                      }}
                      animate={{
                        x: particle.targetX,
                        y: particle.targetY,
                        opacity: [particle.opacity, 0],
                        scale: [1, particle.scale],
                      }}
                      transition={{
                        duration: particle.duration,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  <div
                    className="absolute inset-0 z-10 cursor-crosshair"
                    onMouseMove={handleParticleInteraction}
                    onTouchMove={handleParticleTouch}
                    onClick={triggerParticleExplosion}
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-opacity-70">
                    <p className="text-sm">
                      Move cursor or touch to create particles • Click/tap for
                      explosion
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() =>
                      setParticleMode(
                        particleMode === "attract" ? "repel" : "attract"
                      )
                    }
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
                  >
                    Mode: {particleMode === "attract" ? "Attract" : "Repel"}
                  </button>
                  <button
                    onClick={resetParticles}
                    className="px-6 py-2 bg-muted text-foreground rounded-full hover:bg-muted/90 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Racing Game */}
            {activeTab === "game" && (
              <div className="game-container relative w-full h-full flex flex-col items-center p-4">
                <div className="flex justify-between items-center w-full mb-4">
                  <div className="flex gap-4">
                    <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <p className="font-bold">Score: {gameScore}</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <p className="font-medium text-sm">
                        Distance:{" "}
                        <span className="font-bold">
                          {Math.floor(distance / 10)}m
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-sm flex items-center">
                      <p className="font-medium text-sm mr-2">Lives:</p>
                      {Array.from({ length: lives }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-red-500 rounded-full mx-0.5"
                        ></div>
                      ))}
                    </div>
                    <button
                      onClick={startRace}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm"
                    >
                      {isRaceActive
                        ? "Restart"
                        : isGameOver
                        ? "Play Again"
                        : "Start Race"}
                    </button>
                    <button
                      onClick={() => setShowControls(!showControls)}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/90 transition-all duration-300 text-sm"
                    >
                      Controls
                    </button>
                  </div>
                </div>

                {/* Racing track */}
                <div
                  ref={raceContainerRef}
                  className="relative w-full h-[calc(100%-60px)] bg-gray-800 rounded-lg overflow-hidden"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent, transparent 100px, rgba(255,255,255,0.1) 100px, rgba(255,255,255,0.1) 200px)",
                    backgroundSize: "100% 200px",
                    backgroundPosition: `0 ${distance % 200}px`,
                    transition: "background-position 0.1s linear",
                  }}
                >
                  {/* Lane dividers */}
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-white/30 dashed-line"></div>
                  <div className="absolute top-0 bottom-0 right-1/3 w-[2px] bg-white/30 dashed-line"></div>

                  {/* Player car */}
                  <motion.div
                    className={`absolute bg-red-500 rounded-md z-10 ${
                      isInvincible ? "animate-pulse" : ""
                    }`}
                    style={{
                      width: playerCar.width,
                      height: playerCar.height,
                      left: playerCar.x,
                      top: playerCar.y,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444' stroke='%23000' strokeWidth='1'%3E%3Cpath d='M19 17h2v-8h-6l-2-5H9L7 9H1v8h2M17 18c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3m1-13h1.5l3.5 5h-7l2-5M7 18c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3M5 14l1.5-4.5h4L12 14H5z'/%3E%3C/svg%3E")`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                    animate={{
                      x: playerCar.x,
                      y: playerCar.y,
                      rotate: keyStates.ArrowLeft
                        ? -15
                        : keyStates.ArrowRight
                        ? 15
                        : 0,
                    }}
                    transition={{ type: "spring", damping: 10 }}
                  />

                  {/* Obstacles */}
                  {obstacles.map((obstacle) => (
                    <motion.div
                      key={obstacle.id}
                      className="absolute rounded-md"
                      style={{
                        width: obstacle.width,
                        height: obstacle.height,
                        left: obstacle.x,
                        top: obstacle.y,
                        backgroundColor:
                          obstacle.type === "car"
                            ? "#3b82f6"
                            : obstacle.type === "oil"
                            ? "#000000"
                            : "#f59e0b",
                        backgroundImage:
                          obstacle.type === "car"
                            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6' stroke='%23000' strokeWidth='1'%3E%3Cpath d='M19 17h2v-8h-6l-2-5H9L7 9H1v8h2M17 18c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3m1-13h1.5l3.5 5h-7l2-5M7 18c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3M5 14l1.5-4.5h4L12 14H5z'/%3E%3C/svg%3E")`
                            : obstacle.type === "oil"
                            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000' stroke='%23fff' strokeWidth='0.5'%3E%3Cpath d='M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8m0 2c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6m0 2c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z'/%3E%3C/svg%3E")`
                            : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f59e0b' stroke='%23000' strokeWidth='1'%3E%3Cpath d='M12 1l9 9h-6v13H9V10H3l9-9z'/%3E%3C/svg%3E")`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        borderRadius: obstacle.type === "oil" ? "50%" : "4px",
                      }}
                      animate={{
                        y: obstacle.y,
                      }}
                    />
                  ))}

                  {/* Coins */}
                  {coins.map(
                    (coin) =>
                      !coin.collected && (
                        <motion.div
                          key={coin.id}
                          className="absolute w-[30px] h-[30px] rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center"
                          style={{
                            left: coin.x,
                            top: coin.y,
                            boxShadow: "0 0 10px rgba(234, 179, 8, 0.6)",
                          }}
                          animate={{
                            y: coin.y,
                            rotate: 360,
                          }}
                          transition={{
                            rotate: {
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                              ease: "linear",
                            },
                          }}
                        />
                      )
                  )}

                  {/* Explosion animation */}
                  {showExplosion && (
                    <motion.div
                      className="absolute"
                      style={{
                        width: 100,
                        height: 100,
                        left: explosionPosition.x - 30,
                        top: explosionPosition.y - 30,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444' stroke='%23ffb700' strokeWidth='0.5'%3E%3Cpath d='M11.5 20l4.86-9.73H13V4l-5 9.73h3.5V20M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2z'/%3E%3C/svg%3E")`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 2, opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Speed boost indicator */}
                  {speedBoost > 0 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SPEED BOOST!
                    </div>
                  )}
                </div>

                {/* Touch controls for mobile */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between z-30 md:hidden">
                  <div className="flex gap-2">
                    <button
                      className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center text-primary-foreground"
                      onTouchStart={() => handleTouchControl("left")}
                    >
                      ←
                    </button>
                    <button
                      className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center text-primary-foreground"
                      onTouchStart={() => handleTouchControl("right")}
                    >
                      →
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center text-primary-foreground"
                      onTouchStart={() => handleTouchControl("up")}
                    >
                      ↑
                    </button>
                    <button
                      className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center text-primary-foreground"
                      onTouchStart={() => handleTouchControl("down")}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                {/* Controls modal */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-card p-6 rounded-xl shadow-lg max-w-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-4">
                          Game Controls
                        </h3>
                        <div className="space-y-3 mb-4">
                          <p className="flex items-center">
                            <span className="inline-block w-24 font-medium">
                              Arrow Keys:
                            </span>{" "}
                            Move your car
                          </p>
                          <p className="flex items-center">
                            <span className="inline-block w-24 font-medium">
                              Coins:
                            </span>{" "}
                            +10 points, chance for speed boost
                          </p>
                          <p className="flex items-center">
                            <span className="inline-block w-24 font-medium">
                              Cars:
                            </span>{" "}
                            Avoid! Costs 1 life
                          </p>
                          <p className="flex items-center">
                            <span className="inline-block w-24 font-medium">
                              Oil Slicks:
                            </span>{" "}
                            Reverses controls temporarily
                          </p>
                          <p className="flex items-center">
                            <span className="inline-block w-24 font-medium">
                              Cones:
                            </span>{" "}
                            Avoid! Costs 1 life
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              High Score: {highScore}
                            </p>
                          </div>
                          <button
                            onClick={() => setShowControls(false)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game over modal */}
                <AnimatePresence>
                  {isGameOver && (
                    <motion.div
                      className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="bg-card p-6 rounded-xl shadow-lg text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold mb-2">Game Over!</h3>
                        <p className="mb-1">
                          Your score:{" "}
                          <span className="font-bold text-primary">
                            {gameScore}
                          </span>
                        </p>
                        <p className="mb-4">
                          Distance:{" "}
                          <span className="font-bold">
                            {Math.floor(distance / 10)}m
                          </span>
                        </p>

                        {gameScore > highScore && (
                          <motion.div
                            className="mb-4 p-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: [0.9, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                          >
                            <p className="font-bold">New High Score!</p>
                          </motion.div>
                        )}

                        <button
                          onClick={startRace}
                          className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300"
                        >
                          Play Again
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Voice Magic */}
            {activeTab === "voice" && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="relative w-full h-[80%] bg-background/50 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  {/* Particles */}
                  {particles.map((particle, index) => (
                    <motion.div
                      key={index}
                      className="absolute rounded-full"
                      style={{
                        backgroundColor: particle.color,
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                      }}
                      animate={{
                        y: [0, -100],
                        opacity: [1, 0],
                        scale: [1, 0.5],
                        transition: {
                          duration: particle.speed,
                          ease: "easeOut",
                        },
                      }}
                    />
                  ))}

                  <motion.button
                    className={`w-20 h-20 rounded-full ${
                      isListening ? "bg-red-500" : "bg-primary"
                    } text-primary-foreground flex items-center justify-center shadow-lg`}
                    onClick={startListening}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      isListening
                        ? {
                            scale: [1, 1.1, 1],
                            transition: {
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 1,
                            },
                          }
                        : {}
                    }
                  >
                    <Mic size={30} />
                  </motion.button>

                  {voiceText && (
                    <motion.div
                      className="mt-6 p-4 bg-background/80 backdrop-blur-sm rounded-lg max-w-md text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-medium">{voiceText}</p>
                    </motion.div>
                  )}

                  {isListening && (
                    <motion.div
                      className="absolute bottom-4 left-0 right-0 text-center text-primary font-medium"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                        },
                      }}
                    >
                      Listening...
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Dual Chat */}
            {activeTab === "socket" && <DualChat />}
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default FunActivity;
