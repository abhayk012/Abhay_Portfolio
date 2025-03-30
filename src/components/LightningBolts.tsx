"use client"

import { useEffect, useState, useRef } from "react"

interface LightningBoltsProps {
  enabled?: boolean
  intensity?: "low" | "medium" | "high"
}

const LightningBolts = ({ enabled = true, intensity = "medium" }: LightningBoltsProps) => {
  const [activeBolts, setActiveBolts] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Configure timing based on intensity
    let minDelay: number, maxDelay: number, boltCount: number
    switch (intensity) {
      case "low":
        minDelay = 5000 // 5 seconds
        maxDelay = 15000 // 15 seconds
        boltCount = 2
        break
      case "high":
        minDelay = 2000 // 2 seconds
        maxDelay = 6000 // 6 seconds
        boltCount = 5
        break
      case "medium":
      default:
        minDelay = 3000 // 3 seconds
        maxDelay = 10000 // 10 seconds
        boltCount = 3
        break
    }

    // Function to trigger lightning bolts
    const triggerLightning = () => {
      // Generate random positions for bolts
      const newBolts: number[] = []

      // Create 1-3 bolts per lightning strike
      const numBolts = Math.floor(Math.random() * boltCount) + 1

      for (let i = 0; i < numBolts; i++) {
        newBolts.push(i)
      }

      setActiveBolts(newBolts)

      // Hide bolts after animation
      setTimeout(() => {
        setActiveBolts([])
      }, 1000)

      // Schedule next lightning
      const nextLightningDelay = Math.random() * (maxDelay - minDelay) + minDelay
      timeoutRef.current = setTimeout(triggerLightning, nextLightningDelay)
    }

    // Initial lightning after a delay
    timeoutRef.current = setTimeout(triggerLightning, Math.random() * (maxDelay - minDelay) + minDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, intensity])

  // Function to generate a realistic lightning path
  const generateLightningPath = (): string => {
    // Start at the top center
    let path = "M50,0 "

    // Current position
    let x = 50
    let y = 0

    // Generate random zigzag segments
    const segments = Math.floor(Math.random() * 6) + 5 // 5-10 segments
    const totalHeight = 100
    const heightPerSegment = totalHeight / segments

    for (let i = 1; i <= segments; i++) {
      // Random horizontal deviation
      const deviation = Math.random() * 30 - 15 // -15 to +15
      x = Math.max(5, Math.min(95, x + deviation)) // Keep within 5-95% width

      // Move down by a segment height
      y = heightPerSegment * i

      // Add point to path
      path += `L${x},${y} `
    }

    return path
  }

  // Function to generate a branched lightning path
  const generateBranchedLightningPath = (mainPath: string): string[] => {
    const branches: string[] = []
    const mainPoints = mainPath
      .split(" ")
      .filter((p) => p.startsWith("L"))
      .map((p) => {
        const coords = p.substring(1).split(",")
        return { x: Number.parseFloat(coords[0]), y: Number.parseFloat(coords[1]) }
      })

    // Add 0-3 branches
    const branchCount = Math.floor(Math.random() * 4)

    for (let i = 0; i < branchCount; i++) {
      // Start branch from a random point on the main bolt
      const startIndex = Math.floor(Math.random() * (mainPoints.length - 2)) + 1
      const startPoint = mainPoints[startIndex]

      // Create branch path
      let branchPath = `M${startPoint.x},${startPoint.y} `

      // Current position
      let x = startPoint.x
      let y = startPoint.y

      // Generate 2-4 segments for the branch
      const segments = Math.floor(Math.random() * 3) + 2
      const remainingHeight = 100 - y
      const heightPerSegment = remainingHeight / segments

      for (let j = 1; j <= segments; j++) {
        // Random horizontal deviation (branches tend to go more sideways)
        const deviation = Math.random() * 40 - 20
        x = Math.max(0, Math.min(100, x + deviation))

        // Move down by a segment height
        y = y + heightPerSegment * (Math.random() * 0.5 + 0.5) // Varied segment heights

        // Add point to path
        branchPath += `L${x},${y} `
      }

      branches.push(branchPath)
    }

    return branches
  }

  if (!enabled) return null

  return (
    <div ref={containerRef} className="lightning-bolt-container">
      {/* Main Lightning Bolts */}
      {activeBolts.map((index) => {
        // Random position and size for each bolt
        const left = Math.random() * 80 + 10 // 10-90%
        const width = Math.random() * 5 + 2 // 2-7% of screen width
        const opacity = Math.random() * 0.3 + 0.7 // 0.7-1.0 opacity
        const mainPath = generateLightningPath()
        const branchPaths = generateBranchedLightningPath(mainPath)

        return (
          <div
            key={`bolt-${index}`}
            className="lightning-bolt-element active"
            style={{
              left: `${left}%`,
              width: `${width}vw`,
              top: 0,
              height: "100vh",
              opacity: opacity,
            }}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Main bolt */}
              <path
                d={mainPath}
                stroke="#ffeb3b"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lightning-main-path"
              />

              {/* Inner glow */}
              <path
                d={mainPath}
                stroke="white"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lightning-glow-path"
              />

              {/* Branch bolts */}
              {branchPaths.map((branchPath, branchIndex) => (
                <path
                  key={`branch-${index}-${branchIndex}`}
                  d={branchPath}
                  stroke="#ffeb3b"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lightning-branch-path"
                />
              ))}
            </svg>
          </div>
        )
      })}
    </div>
  )
}

export default LightningBolts

