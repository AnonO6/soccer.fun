import { useBox } from "@react-three/cannon"

interface FieldBoundaryProps {
  position: [number, number, number]
  size: [number, number, number]
}

export function FieldBoundary({ position, size }: FieldBoundaryProps) {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args: size,
  }))

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
    </mesh>
  )
}

