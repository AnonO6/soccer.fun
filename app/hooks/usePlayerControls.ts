"use client"

import { useRef, useEffect } from "react"

export const usePlayerControls = () => {
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false, shift: false })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          keys.current.forward = true
          break
        case "KeyS":
          keys.current.backward = true
          break
        case "KeyA":
          keys.current.left = true
          break
        case "KeyD":
          keys.current.right = true
          break
        case "Space":
          keys.current.jump = true
          break
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = true
          break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          keys.current.forward = false
          break
        case "KeyS":
          keys.current.backward = false
          break
        case "KeyA":
          keys.current.left = false
          break
        case "KeyD":
          keys.current.right = false
          break
        case "Space":
          keys.current.jump = false
          break
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = false
          break
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return keys
}

