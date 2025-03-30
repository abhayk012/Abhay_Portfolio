"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Sun, Moon } from "lucide-react"

interface ToggleProps {
  handleChange: () => void
  isChecked: boolean
}

export const Toggle = ({ handleChange, isChecked }: ToggleProps) => {
  const sunRef = useRef<HTMLSpanElement>(null)
  const moonRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isChecked) {
      gsap.to(moonRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.5 })
      gsap.to(sunRef.current, { opacity: 0, scale: 0.5, y: 20, duration: 0.5 })
    } else {
      gsap.to(moonRef.current, { opacity: 0, scale: 0.5, y: -20, duration: 0.5 })
      gsap.to(sunRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.5 })
    }
  }, [isChecked])

  return (
    <div className="flex items-center justify-center gap-2 cursor-pointer">
      <input type="checkbox" id="check" className="hidden" onChange={handleChange} checked={isChecked} />
      <label
        htmlFor="check"
        className="w-14 h-7 cursor-pointer flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition duration-300"
      >
        <div className="relative w-full flex items-center justify-between px-1">
          <span ref={moonRef}>
            <Moon className="w-5 h-5 text-white dark:text-white" />
          </span>
          <span ref={sunRef}>
            <Sun className="w-8 h-8 text-yellow-500 dark:opacity-0  transform scale-50" />
          </span>
        </div>
      </label>
    </div>
  )
}

export default Toggle

