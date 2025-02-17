"use client"

import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useState, useRef, useEffect } from "react"

interface GoalMessageProps {
  isVisible: boolean
}

export function GoalMessage({ isVisible }: GoalMessageProps) {
  const [opacity, setOpacity] = useState(1)
  const timerRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/goal-cheer.mp3")
    audioRef.current.volume = 0.5 // Adjust volume as needed
  }, [])

  useEffect(() => {
    if (isVisible) {
      setOpacity(1)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setOpacity(0)
      }, 10000) // Start fading after 10 seconds
    } else {
      setOpacity(0)
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isVisible])

  useFrame(() => {
    if (!isVisible && opacity > 0) {
      setOpacity((prev) => Math.max(prev - 0.05, 0))
    }
  })

  if (!isVisible && opacity === 0) return null

  return (
    <Text position={[0, 5, 0]} fontSize={5} color="#ff0000" anchorX="center" anchorY="middle" opacity={opacity}>
      GOAL!
    </Text>
  )
}

