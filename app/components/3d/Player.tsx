"use client"

import { useSphere } from "@react-three/cannon"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Vector3 } from "three"
import { usePlayerControls } from "../../hooks/usePlayerControls" // Updated to use relative import

const WALK_SPEED = 15
const RUN_SPEED = 25
const JUMP_FORCE = 25
const PLAYER_HEIGHT = 1.8
const SPHERE_RADIUS = 0.3
const INITIAL_CAMERA_TILT = 0.15

export function Player({ position = [0, 10, 0] }) {
  const direction = new Vector3()
  const frontVector = new Vector3()
  const sideVector = new Vector3()

  const { camera } = useThree()

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position,
    args: [SPHERE_RADIUS],
    linearDamping: 0.1,
    fixedRotation: true,
  }))

  const playerControls = usePlayerControls()
  const velocity = useRef([0, 0, 0])
  const isGrounded = useRef(false)

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v))
    api.position.subscribe((p) => {
      camera.position.set(p[0], p[1] + PLAYER_HEIGHT - SPHERE_RADIUS, p[2])
    })

    camera.rotation.x = INITIAL_CAMERA_TILT
  }, [api.velocity, api.position, camera])

  useFrame(() => {
    frontVector.set(0, 0, Number(playerControls.current.backward) - Number(playerControls.current.forward))
    sideVector.set(Number(playerControls.current.left) - Number(playerControls.current.right), 0, 0)
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(playerControls.current.shift ? RUN_SPEED : WALK_SPEED)
      .applyEuler(camera.rotation)

    api.velocity.set(direction.x, velocity.current[1], direction.z)

    isGrounded.current = Math.abs(velocity.current[1]) < 0.1

    if (playerControls.current.jump && isGrounded.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2])
    }

    if (!isGrounded.current) {
      api.applyForce([0, -9.8 * 3, 0], [0, 0, 0])
    }
  })

  return <mesh ref={ref} castShadow receiveShadow />
}

