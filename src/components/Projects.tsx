// "use client";

// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { motion } from "framer-motion";
// import { ExternalLink, Github } from "lucide-react";
// import SectionHeading from "./SectionHeading";

// const Projects = () => {
//   const sectionRef = useRef<HTMLElement>(null);
//   const projectsRef = useRef<HTMLDivElement>(null);
//   const projectCards = useRef<(HTMLDivElement | null)[]>([]);
//   const [showAllProjects, setShowAllProjects] = useState(false);

//   // Your projects data
//   const allProjects = [
//     {
//       title: "E-Commerce Platform",
//       description:
//         "Full-featured platform with React, Node.js, and MongoDB featuring user auth, product catalog, shopping cart, and payment integration.",
//       image: "/ecommerce-placeholder.jpg",
//       tags: ["React", "Node.js", "MongoDB", "Express"],
//       github: "#",
//       demo: "#",
//     },
//     {
//       title: "Task Management App",
//       description:
//         "Responsive app with drag-and-drop functionality, user authentication, and real-time updates using Socket.io.",
//       image: "/taskapp-placeholder.jpg",
//       tags: ["React", "TypeScript", "Firebase", "Tailwind"],
//       github: "#",
//       demo: "#",
//     },
//     {
//       title: "Portfolio Website",
//       description:
//         "Modern portfolio with smooth animations, responsive design, and dark mode support.",
//       image: "/portfolio-placeholder.jpg",
//       tags: ["React", "TypeScript", "GSAP", "Tailwind"],
//       github: "#",
//       demo: "#",
//     },
//     {
//       title: "E-Commerce Platform",
//       description:
//         "Full-featured platform with React, Node.js, and MongoDB featuring user auth, product catalog, shopping cart, and payment integration.",
//       image: "/ecommerce-placeholder.jpg",
//       tags: ["React", "Node.js", "MongoDB", "Express"],
//       github: "#",
//       demo: "#",
//     },
//     {
//       title: "Task Management App",
//       description:
//         "Responsive app with drag-and-drop functionality, user authentication, and real-time updates using Socket.io.",
//       image: "/taskapp-placeholder.jpg",
//       tags: ["React", "TypeScript", "Firebase", "Tailwind"],
//       github: "#",
//       demo: "#",
//     },
//     {
//       title: "Portfolio Website",
//       description:
//         "Modern portfolio with smooth animations, responsive design, and dark mode support.",
//       image: "/portfolio-placeholder.jpg",
//       tags: ["React", "TypeScript", "GSAP", "Tailwind"],
//       github: "#",
//       demo: "#",
//     },
//   ];

//   // Determine which projects to display
//   const displayedProjects = showAllProjects
//     ? allProjects
//     : allProjects.slice(0, 3);
//   const hasMoreProjects = allProjects.length > 3;

//   useEffect(() => {
//     gsap.registerPlugin(ScrollTrigger);

//     // Section background animation
//     gsap.fromTo(
//       sectionRef.current,
//       { backgroundColor: "rgba(var(--background), 0.8)" },
//       {
//         backgroundColor: "rgba(var(--background), 1)",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 70%",
//           end: "bottom 20%",
//           scrub: 1,
//         },
//       }
//     );

//     // Project cards animation
//     projectCards.current.forEach((card, i) => {
//       if (!card) return;

//       gsap.from(card, {
//         scrollTrigger: {
//           trigger: card,
//           start: "top 80%",
//           toggleActions: "play none none none",
//         },
//         y: 50,
//         opacity: 0,
//         duration: 0.8,
//         delay: i * 0.1,
//         ease: "power2.out",
//       });

//       // Hover effect
//       gsap.to(card, {
//         y: -10,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });
//     });

//     // Magnetic effect for links
//     const links = projectsRef.current?.querySelectorAll("a");
//     links?.forEach((link) => {
//       link.addEventListener("mousemove", (e) => {
//         const rect = link.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         const centerX = rect.width / 2;
//         const centerY = rect.height / 2;

//         gsap.to(link, {
//           x: (x - centerX) * 0.3,
//           y: (y - centerY) * 0.3,
//           duration: 0.5,
//           ease: "power2.out",
//         });
//       });

//       link.addEventListener("mouseleave", () => {
//         gsap.to(link, {
//           x: 0,
//           y: 0,
//           duration: 0.7,
//           ease: "elastic.out(1, 0.5)",
//         });
//       });
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [showAllProjects]); // Add dependency to re-run when showAllProjects changes

//   const toggleShowAllProjects = () => {
//     setShowAllProjects(!showAllProjects);
//   };

//   return (
//     <section
//       id="projects"
//       ref={sectionRef}
//       className="py-24 relative overflow-hidden"
//       style={{
//         background:
//           "linear-gradient(135deg, rgba(var(--background), 0.9) 0%, rgba(var(--primary)/0.1) 100%)",
//       }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(10)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full bg-primary/5"
//             initial={{
//               x: Math.random() * 100,
//               y: Math.random() * 100,
//               width: Math.random() * 300 + 100,
//               height: Math.random() * 300 + 100,
//             }}
//             animate={{
//               x: Math.random() * 100 - 50,
//               y: Math.random() * 100 - 50,
//               transition: {
//                 duration: Math.random() * 10 + 10,
//                 repeat: Infinity,
//                 repeatType: "reverse",
//                 ease: "linear",
//               },
//             }}
//           />
//         ))}
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <SectionHeading
//           title="Featured Projects"
//           subtitle="Each project represents a unique challenge and creative solution"
//         />

//         <div
//           ref={projectsRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
//         >
//           {displayedProjects.map((project, index) => (
//             <motion.div
//               key={index}
//               ref={(el) => (projectCards.current[index] = el)}
//               className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
//               whileHover={{ y: -10 }}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               {/* Image with gradient overlay */}
//               <div className="relative h-60 overflow-hidden">
//                 <img
//                   src={project.image}
//                   alt={project.title}
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               </div>

//               {/* Content */}
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-3">
//                   <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
//                     {project.title}
//                   </h3>
//                   <div className="flex gap-3">
//                     {project.github && (
//                       <motion.a
//                         href={project.github}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-muted-foreground hover:text-primary transition-colors duration-300"
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <Github className="w-5 h-5" />
//                       </motion.a>
//                     )}
//                     {project.demo && (
//                       <motion.a
//                         href={project.demo}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-muted-foreground hover:text-primary transition-colors duration-300"
//                         whileHover={{ scale: 1.2 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <ExternalLink className="w-5 h-5" />
//                       </motion.a>
//                     )}
//                   </div>
//                 </div>

//                 <p className="text-muted-foreground mb-4 line-clamp-3">
//                   {project.description}
//                 </p>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {project.tags.map((tag, tagIndex) => (
//                     <motion.span
//                       key={tagIndex}
//                       className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
//                       whileHover={{
//                         scale: 1.05,
//                         backgroundColor: "rgba(var(--primary), 1)",
//                         color: "rgba(var(--primary-foreground), 1)",
//                       }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       {tag}
//                     </motion.span>
//                   ))}
//                 </div>

//                 {/* Hover effect */}
//                 <div
//                   className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                   style={{
//                     boxShadow: `0 0 30px 5px rgba(var(--primary)/0.2)`,
//                     background: `radial-gradient(circle at center, rgba(var(--primary)/0.05) 0%, transparent 70%)`,
//                   }}
//                 />
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* View more button - only shown if there are more than 3 projects */}
//         {hasMoreProjects && (
//           <div className="text-center mt-16">
//             <motion.button
//               onClick={toggleShowAllProjects}
//               className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {showAllProjects ? "Show Less" : "View All Projects"}
//               {/* <ExternalLink className="w-4 h-4 ml-2" /> */}
//             </motion.button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Projects;



"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Observer } from "gsap/Observer"
import { ExternalLink, Github } from "lucide-react"
import SectionHeading from "./SectionHeading"
import ScrollAnimationWrapper from "./ScrollAnimationWrapper"

gsap.registerPlugin(ScrollTrigger, Observer)

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)

  const projects: Project[] = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      github: "#",
      demo: "#",
    },
    {
      title: "Task Management App",
      description:
        "A responsive task management application with drag-and-drop functionality, user authentication, and real-time updates using Socket.io.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
      github: "#",
      demo: "#",
    },
    {
      title: "Portfolio Website",
      description:
        "A modern portfolio website built with React and TypeScript. Features smooth animations, responsive design, and dark mode support.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "TypeScript", "GSAP", "Tailwind CSS"],
      github: "#",
      demo: "#",
    },
  ]

  useEffect(() => {
    const section = sectionRef.current

    if (section) {
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
          })
        },
        onLeave: () => {
          // Animate section exit
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 0.5)",
            duration: 0.8,
            ease: "power2.inOut",
          })
        },
        onEnterBack: () => {
          // Animate section re-entrance
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 1)",
            duration: 0.8,
            ease: "power2.inOut",
          })
        },
        onLeaveBack: () => {
          // Animate section exit from top
          gsap.to(section, {
            backgroundColor: "rgba(var(--background), 0.5)",
            duration: 0.8,
            ease: "power2.inOut",
          })
        },
      })

      return () => {
        sectionTrigger.kill()
      }
    }
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="py-20 transition-colors duration-500" data-speed="1.05">
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper animation="reveal" duration={0.8}>
          <SectionHeading
            title="My Projects"
            subtitle="Here are some of my recent projects that showcase my skills and experience"
          />
        </ScrollAnimationWrapper>

        <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollAnimationWrapper key={index} animation="scale" duration={0.8} delay={index * 0.2}>
              <div
                className="project-card bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-3 group"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative overflow-hidden h-48" style={{ transformStyle: "preserve-3d" }}>
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ transform: "translateZ(20px)" }}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
                </div>

                <div className="p-6" style={{ transformStyle: "preserve-3d" }}>
                  <h3
                    className="text-xl font-semibold mb-2 text-black dark:text-foreground group-hover:text-primary transition-colors duration-300"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-black dark:text-muted-foreground mb-4" style={{ transform: "translateZ(25px)" }}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4" style={{ transform: "translateZ(35px)" }}>
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between" style={{ transform: "translateZ(40px)" }}>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-black dark:text-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transition-transform"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-black dark:text-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transition-transform"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects

