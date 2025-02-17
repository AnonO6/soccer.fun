import { Text } from "@react-three/drei"

interface ScoreboardProps {
  homeScore: number
  awayScore: number
}

export function Scoreboard({ homeScore, awayScore }: ScoreboardProps) {
  return (
    <Text position={[0, 10, 0]} fontSize={2} color="#000000" anchorX="center" anchorY="middle">
      {`${homeScore} - ${awayScore}`}
    </Text>
  )
}

