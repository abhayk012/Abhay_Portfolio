"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import SectionHeading from "./SectionHeading";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";
import me from "/PORTFOLIO IMG.png";
gsap.registerPlugin(ScrollTrigger, Observer);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const typingTextRef = useRef<HTMLParagraphElement>(null);
  const [typingComplete, setTypingComplete] = useState(false);

  // Text for typing animation
  const typingText =
    "I'm a passionate front-end developer with expertise in creating responsive, user-friendly web applications. I specialize in modern JavaScript frameworks like React and have experience with TypeScript, Next.js, and Vite.";

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    const typingTextElement = typingTextRef.current;

    if (section && content && image && typingTextElement) {
      // Create ScrollTrigger for the section
      const sectionTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        onEnter: () => {
          // Start typing animation when section enters viewport
          if (!typingComplete) {
            typingTextElement.textContent = "";
            let i = 0;

            const typeText = () => {
              if (i < typingText.length) {
                typingTextElement.textContent += typingText.charAt(i);
                i++;
                setTimeout(typeText, 20);
              } else {
                setTypingComplete(true);
              }
            };

            setTimeout(typeText, 500);
          }

          // Animate section entrance
          gsap.to(section, {
            backgroundColor: "rgba(var(--muted), 0.3)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
        onLeave: () => {
          // Animate section exit
          gsap.to(section, {
            backgroundColor: "rgba(var(--muted), 0)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
        onEnterBack: () => {
          // Animate section re-entrance
          gsap.to(section, {
            backgroundColor: "rgba(var(--muted), 0.3)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
        onLeaveBack: () => {
          // Animate section exit from top
          gsap.to(section, {
            backgroundColor: "rgba(var(--muted), 0)",
            duration: 0.8,
            ease: "power2.inOut",
          });
        },
      });

      // Set up animations for image and content
      gsap.set([image, content], {
        opacity: 0,
        x: (el) => (el === image ? -50 : 50),
      });

      // Create ScrollTrigger for image
      const imageTrigger = ScrollTrigger.create({
        trigger: image,
        start: "top 80%",
        onEnter: () => {
          gsap.to(image, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
          });

          // Add floating animation after image appears
          gsap.to(image, {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1,
          });
        },
        once: true,
      });

      // Create ScrollTrigger for content
      const contentTrigger = ScrollTrigger.create({
        trigger: content,
        start: "top 80%",
        onEnter: () => {
          gsap.to(content, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.3,
          });

          // Stagger animate the second paragraph and button
          gsap.from(content.querySelectorAll("p:not(:first-child), .pt-4"), {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.8,
            ease: "power2.out",
          });
        },
        once: true,
      });

      // 3D rotation effect on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = section.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        gsap.to(image, {
          rotationY: x * 8,
          rotationX: -y * 8,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power1.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(image, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: "power1.out",
        });
      };

      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
        sectionTrigger.kill();
        imageTrigger.kill();
        contentTrigger.kill();
        gsap.killTweensOf(image);
      };
    }
  }, [typingComplete, typingText]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 transition-colors duration-500"
      data-speed="0.9"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper animation="reveal" duration={0.8}>
          <SectionHeading
            title="About Me"
            subtitle="Get to know more about me and my journey as a developer"
          />
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollAnimationWrapper animation="slide" duration={1} delay={0.2}>
            <div ref={imageRef} className="relative group parallax-slow">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full mx-auto flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-105">
                {/* <User className="w-32 h-32 text-primary group-hover:text-primary/80 transition-colors duration-300" /> */}
                <div>
                  <img src={me} alt="" className="me" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full -z-10 group-hover:scale-125 group-hover:bg-primary/30 transition-all duration-500 parallax-fast"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/15 rounded-full -z-10 group-hover:scale-125 group-hover:bg-primary/25 transition-all duration-500 parallax-fast"></div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animation="fade" duration={1} delay={0.4}>
            <div ref={contentRef} className="space-y-4 group">
              <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors duration-300">
                Front-End Web <span className="text-red-500">Developer</span>
              </h3>
              <p
                ref={typingTextRef}
                className="text-black dark:text-foreground group-hover:text-foreground transition-colors duration-300"
              >
                {typingComplete ? typingText : ""}
              </p>
              <p className="text-black dark:text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                My goal is to build applications that not only look great but
                also provide exceptional user experiences. I'm constantly
                learning new technologies and techniques to improve my skills
                and stay current with industry trends.
              </p>
              <div className="pt-4">
                <a
                  href="#contact"
                  className="px-6 py-3 bg-primary dark:text-black text-white rounded-full hover:bg-primary/90 transition-all duration-300 inline-block hover:scale-105 hover:shadow-lg"
                >
                  Let's Talk
                </a>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default About;
