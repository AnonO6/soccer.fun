import { useBox } from "@react-three/cannon"
import { useRef } from "react"
import type { Mesh } from "three"

interface GoalPostProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export function GoalPost({ position, rotation = [0, 0, 0] }: GoalPostProps) {
  const [ref] = useBox(() => ({
    mass: 0,
    position,
    rotation,
    args: [0.2, 2.5, 0.2], // Adjust size as needed
  }))

  const meshRef = useRef<Mesh>(null)

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[0.2, 2.5, 0.2]} />
      <meshStandardMaterial color="#000000" /> {/* Changed to black */}
    </mesh>
  )
}

