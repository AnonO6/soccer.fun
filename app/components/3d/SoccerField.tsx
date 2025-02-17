"use client"

import { usePlane } from "@react-three/cannon"
import * as THREE from "three"
import { useMemo } from "react"

const FIELD_WIDTH = 105 // Standard FIFA field width in meters
const FIELD_LENGTH = 68 // Standard FIFA field length in meters

export function SoccerField() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext("2d")
    if (context) {
      // Fill the canvas with green
      context.fillStyle = "#4CAF50"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Draw white lines
      context.strokeStyle = "#000000" // Updated line color to black
      context.lineWidth = 4

      // Outline
      context.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)

      // Center line
      context.beginPath()
      context.moveTo(canvas.width / 2, 50)
      context.lineTo(canvas.width / 2, canvas.height - 50)
      context.stroke()

      // Center circle
      context.beginPath()
      context.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI)
      context.stroke()

      // Penalty areas
      const penaltyAreaWidth = 300
      const penaltyAreaHeight = 150
      context.strokeRect(50, (canvas.height - penaltyAreaHeight) / 2, penaltyAreaWidth, penaltyAreaHeight)
      context.strokeRect(
        canvas.width - 50 - penaltyAreaWidth,
        (canvas.height - penaltyAreaHeight) / 2,
        penaltyAreaWidth,
        penaltyAreaHeight,
      )
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    return texture
  }, [])

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[FIELD_WIDTH, FIELD_LENGTH]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

