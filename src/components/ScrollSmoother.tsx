"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollSmoother as GSAPScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, GSAPScrollSmoother)

interface ScrollSmootherProps {
  children: React.ReactNode
}

const ScrollSmoother = ({ children }: ScrollSmootherProps) => {
  const smoothWrapperRef = useRef<HTMLDivElement>(null)
  const smoothContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create the smooth scroller
    const smoother = GSAPScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1.5, // Adjust smoothness (higher = slower)
      effects: true, // Enable effects for data-speed attributes
      normalizeScroll: true, // Prevents jerky scrolling in some browsers
      ignoreMobileResize: true, // Helps with mobile browser address bar issues
    })

    // Refresh ScrollTrigger to ensure everything works with ScrollSmoother
    ScrollTrigger.refresh()

    return () => {
      // Clean up
      smoother.kill()
    }
  }, [])

  return (
    <div ref={smoothWrapperRef} className="smooth-wrapper">
      <div ref={smoothContentRef} className="smooth-content">
        {children}
      </div>
    </div>
  )
}

export default ScrollSmoother

