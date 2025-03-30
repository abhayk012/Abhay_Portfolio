"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";

// React Icons
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaNpm,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiRedux,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobexd,
} from "react-icons/si";
import { BiLogoVisualStudio } from "react-icons/bi";

gsap.registerPlugin(ScrollTrigger, Observer);

interface Skill {
  name: string;
  icon: JSX.Element;
  color: string;
  category: string;
  proficiency: number; // 1-5 scale
}

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const skillCategories = ["All", "Frontend", "Backend", "Tools", "Design"];

  const skills: Skill[] = [
    // Frontend
    {
      name: "HTML5",
      icon: <FaHtml5 />,
      color: "#E34F26",
      category: "Frontend",
      proficiency: 5,
    },
    {
      name: "CSS3",
      icon: <FaCss3Alt />,
      color: "#1572B6",
      category: "Frontend",
      proficiency: 5,
    },
    {
      name: "JavaScript",
      icon: <FaJs />,
      color: "#F7DF1E",
      category: "Frontend",
      proficiency: 5,
    },
    {
      name: "TypeScript",
      icon: <SiTypescript />,
      color: "#3178C6",
      category: "Frontend",
      proficiency: 4,
    },
    {
      name: "React",
      icon: <FaReact />,
      color: "#61DAFB",
      category: "Frontend",
      proficiency: 5,
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs />,
      color: "#000000",
      category: "Frontend",
      proficiency: 4,
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss />,
      color: "#06B6D4",
      category: "Frontend",
      proficiency: 5,
    },
    {
      name: "Redux",
      icon: <SiRedux />,
      color: "#764ABC",
      category: "Frontend",
      proficiency: 4,
    },

    // Backend
    {
      name: "Node.js",
      icon: <FaNodeJs />,
      color: "#339933",
      category: "Backend",
      proficiency: 4,
    },
    {
      name: "Express",
      icon: <SiExpress />,
      color: "#000000",
      category: "Backend",
      proficiency: 4,
    },
    {
      name: "MongoDB",
      icon: <SiMongodb />,
      color: "#47A248",
      category: "Backend",
      proficiency: 3,
    },
    {
      name: "Firebase",
      icon: <SiFirebase />,
      color: "#FFCA28",
      category: "Backend",
      proficiency: 3,
    },

    // Tools
    {
      name: "Git",
      icon: <FaGitAlt />,
      color: "#F05032",
      category: "Tools",
      proficiency: 4,
    },
    {
      name: "GitHub",
      icon: <FaGithub />,
      color: "#181717",
      category: "Tools",
      proficiency: 5,
    },
    {
      name: "VS Code",
      icon: <BiLogoVisualStudio  />,
      color: "#007ACC",
      category: "Tools",
      proficiency: 5,
    },
    {
      name: "npm",
      icon: <FaNpm />,
      color: "#CB3837",
      category: "Tools",
      proficiency: 4,
    },

    // Design
    {
      name: "Figma",
      icon: <SiFigma />,
      color: "#F24E1E",
      category: "Design",
      proficiency: 4,
    },
    {
      name: "Photoshop",
      icon: <SiAdobephotoshop />,
      color: "#31A8FF",
      category: "Design",
      proficiency: 3,
    },
    {
      name: "Illustrator",
      icon: <SiAdobeillustrator />,
      color: "#FF9A00",
      category: "Design",
      proficiency: 3,
    },
    {
      name: "XD",
      icon: <SiAdobexd />,
      color: "#FF61F6",
      category: "Design",
      proficiency: 3,
    },
  ];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  useEffect(() => {
    const section = sectionRef.current;
    const skillsContainer = skillsRef.current;

    if (section && skillsContainer) {
      // Create a gradient animation for the section background
      gsap.fromTo(
        section,
        {
          background:
            "linear-gradient(135deg, rgba(var(--background), 0.8) 0%, rgba(var(--primary)/0.1) 100%)",
        },
        {
          background:
            "linear-gradient(135deg, rgba(var(--background), 0.9) 0%, rgba(var(--primary)/0.2) 100%)",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Floating animation for skill items
      const skillItems = skillsContainer.querySelectorAll(".skill-item");
      skillItems.forEach((item) => {
        gsap.to(item, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Magnetic effect for category buttons
      const categoryButtons =
        categoriesRef.current?.querySelectorAll(".category-btn") || [];
      categoryButtons.forEach((button: Element) => {
        button.addEventListener("mousemove", (e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const angle = (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;

          gsap.to(button, {
            x: (x - centerX) * 0.2,
            y: (y - centerY) * 0.2,
            rotation: angle * 0.05,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)",
          });
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [activeCategory]);

  const proficiencyBars = (level: number) => {
    return (
      <div className="flex gap-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${
              i < level ? "bg-current" : "bg-gray-500/30"
            }`}
            style={{ width: `${level === 5 && i === 4 ? "100%" : "16px"}` }}
          />
        ))}
      </div>
    );
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 relative overflow-hidden transition-colors duration-500"
      style={{
        background:
          "linear-gradient(135deg, rgba(var(--background), 0.8) 0%, rgba(var(--primary)/0.1) 100%)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0.1,
            }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              },
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimationWrapper animation="reveal" duration={0.8}>
          <SectionHeading
            title="My Skills"
            subtitle="I've worked with a variety of technologies in the web development world. Here are my main areas of expertise."
          />
        </ScrollAnimationWrapper>

        {/* Categories */}
        <ScrollAnimationWrapper animation="fade" duration={0.8} delay={0.2}>
          <div
            ref={categoriesRef}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {skillCategories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileTap={{ scale: 0.9 }}
                className={`category-btn px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {activeCategory === category && (
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    layoutId="activeCategory"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        </ScrollAnimationWrapper>

        {/* Hovered Skill Details */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 rounded-xl backdrop-blur-sm bg-background/50 border border-border shadow-lg max-w-md mx-auto"
              style={{ borderColor: hoveredSkill.color }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ color: hoveredSkill.color }}
                >
                  {hoveredSkill.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{hoveredSkill.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {hoveredSkill.category}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Proficiency</span>
                  <span className="text-xs text-muted-foreground">
                    {hoveredSkill.proficiency}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${hoveredSkill.proficiency * 20}%`,
                      backgroundColor: hoveredSkill.color,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills Grid */}
        <div
          ref={skillsRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-item flex flex-col items-center justify-center p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{
                borderColor: skill.color + "30",
                boxShadow: `0 4px 15px ${skill.color}10`,
              }}
            >
              {/* Hover effect background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${skill.color}20 0%, transparent 70%)`,
                }}
              />

              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  backgroundColor: `${skill.color}15`,
                  color: skill.color,
                }}
              >
                <motion.div whileHover={{ scale: 1.2 }} className="text-3xl">
                  {skill.icon}
                </motion.div>
              </div>

              <h3 className="text-center font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {skill.name}
              </h3>

              {/* Proficiency indicator (small) */}
              <div className="mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
                {proficiencyBars(skill.proficiency)}
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `0 0 20px 5px ${skill.color}30`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredSkills.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">🧐</div>
            <h3 className="text-xl font-medium">
              No skills found in this category
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different category
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
