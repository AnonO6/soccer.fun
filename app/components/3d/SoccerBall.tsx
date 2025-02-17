"use client"

import { useSphere } from "@react-three/cannon"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import React, { useEffect, useRef, useImperativeHandle } from "react"
import { MODELS } from "../../constants/models"
import { SOUNDS } from "../../constants/sounds"
import { Vector3 } from "three"

interface SoccerBallProps {
  onPositionUpdate: (position: Vector3) => void
}

export const SoccerBall = React.memo(
  React.forwardRef(({ onPositionUpdate }: SoccerBallProps, ref) => {
    const { scene } = useGLTF(MODELS.soccerBall)
    const [sphereRef, api] = useSphere(() => ({
      mass: 0.1,
      position: [0, 0.6, -5],
      args: [0.6],
      friction: 0.1,
      restitution: 0.7,
      linearDamping: 0.5,
      angularDamping: 0.2,
      onCollide: handleCollision,
    }))

    const sound = useRef(new Audio(SOUNDS.ballHit))
    const lastCollisionTime = useRef(0)
    const hasInteracted = useRef(false)

    useImperativeHandle(ref, () => ({
      reset: () => {
        api.position.set(0, 0.6, -5)
        api.velocity.set(0, 0, 0)
        api.angularVelocity.set(0, 0, 0)
      },
    }))

    useEffect(() => {
      const handleInteraction = () => {
        hasInteracted.current = true
        window.removeEventListener("click", handleInteraction)
        window.removeEventListener("keydown", handleInteraction)
      }

      window.addEventListener("click", handleInteraction)
      window.addEventListener("keydown", handleInteraction)

      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      return () => {
        window.removeEventListener("click", handleInteraction)
        window.removeEventListener("keydown", handleInteraction)
      }
    }, [scene])

    function handleCollision() {
      const currentTime = Date.now()
      if (hasInteracted.current && currentTime - lastCollisionTime.current > 100) {
        sound.current.currentTime = 0
        sound.current.play()
        lastCollisionTime.current = currentTime
      }
    }

    useFrame(() => {
      api.position.subscribe((position) => {
        if (position[1] < -100) {
          api.position.set(0, 10, -5)
          api.velocity.set(0, 0, 0)
        }
        onPositionUpdate(new Vector3(position[0], position[1], position[2]))
      })
    })

    return <primitive ref={sphereRef} object={scene.clone()} scale={[0.6, 0.6, 0.6]} />
  }),
)

SoccerBall.displayName = "SoccerBall"

