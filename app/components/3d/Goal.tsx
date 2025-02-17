import { GoalPost } from "./GoalPost"

interface GoalProps {
  position: [number, number, number]
  rotation?: [number, number, number]
}

export function Goal({ position, rotation = [0, 0, 0] }: GoalProps) {
  const [x, y, z] = position
  const width = 7.32 // Standard FIFA goal width
  const height = 2.44 // Standard FIFA goal height

  return (
    <group position={position} rotation={rotation}>
      <GoalPost position={[-width / 2, height / 2, 0]} />
      <GoalPost position={[width / 2, height / 2, 0]} />
      <GoalPost position={[0, height, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  )
}

