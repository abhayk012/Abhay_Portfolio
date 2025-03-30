"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Briefcase, Calendar, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  type: string;
  highlights?: string[];
}

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const experienceItems = useRef<(HTMLDivElement | null)[]>([]);

  const experiences: ExperienceItem[] = [
    {
      title: "MERN Stack Developer",
      company: "Lym Data Labs",
      period: "2022 - Present",
      description:
        "Working on live projects using the MERN stack. Developing responsive web applications, implementing RESTful APIs, and collaborating with cross-functional teams.",
      type: "Full-time",
      highlights: [
        "Built 10+ production applications",
        "Improved performance by 40%",
        "Mentored junior developers",
      ],
    },
    {
      title: "Freelance Developer",
      company: "CRM Website Project",
      period: "2022",
      description:
        "Developed a custom CRM solution with user authentication, dashboard analytics, and customer management features.",
      type: "Freelance",
      highlights: [
        "Delivered project 2 weeks early",
        "Client satisfaction score: 98%",
        "Implemented CI/CD pipeline",
      ],
    },
    {
      title: "Web Developer",
      company: "Garmin Website Project",
      period: "2021",
      description:
        "Collaborated on website development focusing on frontend implementation, responsive design, and performance optimization.",
      type: "Freelance",
      highlights: [
        "Improved Lighthouse score by 35%",
        "Reduced load time by 60%",
        "Implemented accessibility features",
      ],
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Force visibility on the section and its contents
    if (sectionRef.current) {
      gsap.set(sectionRef.current, { visibility: "visible", opacity: 1 });
    }
    if (timelineRef.current) {
      gsap.set(timelineRef.current, { visibility: "visible", opacity: 1 });
    }

    // Force visibility on all experience items
    experienceItems.current.forEach((item) => {
      if (item) {
        gsap.set(item, { visibility: "visible", opacity: 1 });
      }
    });

    // Force visibility on timeline elements
    gsap.set(".timeline-line", { visibility: "visible", opacity: 1 });
    gsap.set(".timeline-dot", { visibility: "visible", opacity: 1 });
    gsap.set(".highlight-item", { visibility: "visible", opacity: 1 });

    // Initial visibility
    gsap.set([sectionRef.current, timelineRef.current], { autoAlpha: 1 });

    // Section background animation
    gsap.fromTo(
      sectionRef.current,
      { backgroundColor: "rgba(var(--muted), 0)" },
      {
        backgroundColor: "rgba(var(--muted), 0.3)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );

    // Timeline line animation - ensure visibility first
    gsap.set(".timeline-line", {
      visibility: "visible",
      opacity: 1,
      height: "100%",
      scaleY: 1,
    });

    // Then animate it
    gsap.from(".timeline-line", {
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 60%",
        toggleActions: "play none none none",
      },
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        // Ensure the timeline is visible after animation
        gsap.set(".timeline-line", {
          visibility: "visible",
          opacity: 1,
          height: "100%",
        });
      },
    });

    // Experience items animation
    experienceItems.current.forEach((item, index) => {
      if (!item) return;

      const direction = index % 2 === 0 ? 50 : -50;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(item, {
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      tl.from(
        item.querySelector(".timeline-dot"),
        {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      tl.from(
        item.querySelectorAll(".highlight-item"),
        {
          x: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power1.out",
        },
        "-=0.3"
      );
    });

    // Force a refresh of ScrollTrigger
    ScrollTrigger.refresh();

    gsap.set(".timeline-dot", {
      visibility: "visible",
      opacity: 1,
      scale: 1,
      top: "6px",
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(var(--background), 0.9) 0%, rgba(var(--primary)/0.05) 100%)",
        visibility: "visible", // Force visibility
        opacity: 1, // Force opacity
      }}
    >
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
            }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              },
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Professional Journey"
          subtitle="My career path and significant milestones"
          align="center"
        />

        <div ref={timelineRef} className="relative mt-12 sm:mt-16">
          {/* Animated timeline line */}
          <div
            className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-transparent"
            style={{ visibility: "visible", opacity: 1, height: "100%" }}
          ></div>

          {/* Experience items */}
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => (experienceItems.current[index] = el)}
              className={`relative mb-12 sm:mb-16 group ${
                index % 2 === 0
                  ? "md:pr-16 md:text-right md:ml-auto"
                  : "md:pl-16 md:text-left"
              } md:w-1/2 w-full pl-12 sm:pl-16 text-left`}
              style={{ visibility: "visible", opacity: 1 }} // Force visibility
            >
              {/* Interactive timeline dot - Fixed positioning */}
              <div
                className="timeline-dot absolute top-0 left-4 sm:left-6 md:left-auto md:right-0 transform md:translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-card z-10 group-hover:scale-125 group-hover:shadow-lg transition-all duration-300"
                style={{
                  visibility: "visible",
                  opacity: 1,
                  top: "6px", // Explicitly set top position
                }}
              ></div>

              {/* Experience card */}
              <motion.div
                className="bg-card rounded-xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                whileHover={{ y: -10 }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 0 30px 5px rgba(var(--primary)/0.1)`,
                    background: `radial-gradient(circle at center, rgba(var(--primary)/0.05) 0%, transparent 70%)`,
                  }}
                />

                {/* Header with title and type */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 md:gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {exp.title}
                  </h3>
                  <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 inline-block w-fit">
                    {exp.type}
                  </span>
                </div>

                {/* Company and period */}
                <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300 text-sm sm:text-base">
                      {exp.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300 text-sm sm:text-base">
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 sm:mb-6 group-hover:text-foreground transition-colors duration-300 text-sm sm:text-base">
                  {exp.description}
                </p>

                {/* Highlights with animated bullets */}
                <div className="space-y-1 sm:space-y-2">
                  {exp.highlights?.map((highlight, i) => (
                    <motion.div
                      key={i}
                      className="highlight-item flex items-start gap-1 sm:gap-2 text-xs sm:text-sm"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
