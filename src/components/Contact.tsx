"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";

gsap.registerPlugin(ScrollTrigger, Observer);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // Show success message
    alert("Message sent successfully!");
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (section) {
      // Create ScrollTrigger for the section
      const sectionTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        onEnter: () => {
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

      return () => {
        sectionTrigger.kill();
      };
    }
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 transition-colors duration-500"
      data-speed="0.95"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper animation="reveal" duration={0.8}>
          <SectionHeading
            title="Get In Touch"
            subtitle="Have a project in mind or want to discuss a potential collaboration? Feel free to reach out!"
          />
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ScrollAnimationWrapper animation="slide" duration={0.8} delay={0.2}>
            <div ref={infoRef} className="space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group">
                <h3 className="text-xl font-semibold mb-6 group-hover:text-primary transition-colors duration-300">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="contact-item flex items-start group/item hover:-translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <a
                        href="mailto:abhay@example.com"
                        className="text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        abhay@example.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-item flex items-start group/item hover:-translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <a
                        href="tel:+1234567890"
                        className="text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>

                  <div className="contact-item flex items-start group/item hover:-translate-x-1 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">Bangalore, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <h3 className="text-xl font-semibold mb-4 hover:text-primary transition-colors duration-300">
                  Follow Me
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="social-icon w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animation="fade" duration={0.8} delay={0.4}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-xl font-semibold mb-6 group-hover:text-primary transition-colors duration-300">
                Send Me a Message
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors duration-300"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-input w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background hover:border-primary transition-colors duration-300 focus:scale-[1.01] transition-transform"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors duration-300"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-input w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background hover:border-primary transition-colors duration-300 focus:scale-[1.01] transition-transform"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors duration-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="contact-input w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background hover:border-primary transition-colors duration-300 focus:scale-[1.01] transition-transform"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors duration-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="contact-input w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background hover:border-primary transition-colors duration-300 focus:scale-[1.01] transition-transform resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact-input w-full flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default Contact;
