"use client"

import { Physics } from "@react-three/cannon"
import { Environment, Text } from "@react-three/drei"
import { Player } from "./Player"
import { SoccerBall } from "./SoccerBall"
import { Goal } from "./Goal"
import { SoccerField } from "./SoccerField"
import { FieldBoundary } from "./FieldBoundary"
import { GoalMessage } from "./GoalMessage"
import { Scoreboard } from "./Scoreboard"
import { useState, useCallback, useRef, useEffect } from "react"
import { Vector3 } from "three"

const FIELD_WIDTH = 105
const FIELD_LENGTH = 68
const BOUNDARY_HEIGHT = 3
const GOAL_WIDTH = 7.32
const GOAL_HEIGHT = 2.44
const GOAL_DEPTH = 2.44
const WINNING_SCORE = 3

interface SceneProps {
  playerName: string
  opponentName: string
  onGameEnd: (winner: string, player1: string, player2: string, score: [number, number]) => void
}

export function Scene({ playerName, opponentName, onGameEnd }: SceneProps) {
  const [ballPosition, setBallPosition] = useState(new Vector3())
  const [isGoal, setIsGoal] = useState(false)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const ballRef = useRef<any>(null)
  const lastGoalTimeRef = useRef(0)
  const goalCooldownRef = useRef(false)

  useEffect(() => {
    if (isGoal) {
      const timer = setTimeout(() => {
        setIsGoal(false)
        goalCooldownRef.current = false
        if (ballRef.current) {
          ballRef.current.reset()
        }
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isGoal])

  useEffect(() => {
    if (homeScore === WINNING_SCORE || awayScore === WINNING_SCORE) {
      const winner = homeScore === WINNING_SCORE ? playerName : opponentName
      onGameEnd(winner, playerName, opponentName, [homeScore, awayScore])
    }
  }, [homeScore, awayScore, playerName, opponentName, onGameEnd])

  const handleBallPositionUpdate = useCallback((position: Vector3) => {
    setBallPosition(position)

    const currentTime = Date.now()
    if (!goalCooldownRef.current && currentTime - lastGoalTimeRef.current > 10000) {
      // Check if the ball is inside either goal
      if (
        position.z < -FIELD_LENGTH / 2 + GOAL_DEPTH &&
        position.z > -FIELD_LENGTH / 2 &&
        Math.abs(position.x) < GOAL_WIDTH / 2 &&
        position.y < GOAL_HEIGHT
      ) {
        setIsGoal(true)
        setAwayScore((prev) => prev + 1)
        lastGoalTimeRef.current = currentTime
        goalCooldownRef.current = true
      } else if (
        position.z > FIELD_LENGTH / 2 - GOAL_DEPTH &&
        position.z < FIELD_LENGTH / 2 &&
        Math.abs(position.x) < GOAL_WIDTH / 2 &&
        position.y < GOAL_HEIGHT
      ) {
        setIsGoal(true)
        setHomeScore((prev) => prev + 1)
        lastGoalTimeRef.current = currentTime
        goalCooldownRef.current = true
      }
    }
  }, [])

  return (
    <Physics gravity={[0, -9.8, 0]}>
      <Environment preset="sunset" background />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Player />
      <SoccerField />
      <SoccerBall ref={ballRef} onPositionUpdate={handleBallPositionUpdate} />
      <Goal position={[0, 0, -FIELD_LENGTH / 2 + 1]} rotation={[0, Math.PI, 0]} />
      <Goal position={[0, 0, FIELD_LENGTH / 2 - 1]} />

      {/* Field Boundaries */}
      <FieldBoundary
        position={[0, BOUNDARY_HEIGHT / 2, -FIELD_LENGTH / 2 - 1]}
        size={[FIELD_WIDTH + 2, BOUNDARY_HEIGHT, 2]}
      />
      <FieldBoundary
        position={[0, BOUNDARY_HEIGHT / 2, FIELD_LENGTH / 2 + 1]}
        size={[FIELD_WIDTH + 2, BOUNDARY_HEIGHT, 2]}
      />
      <FieldBoundary
        position={[-FIELD_WIDTH / 2 - 1, BOUNDARY_HEIGHT / 2, 0]}
        size={[2, BOUNDARY_HEIGHT, FIELD_LENGTH + 2]}
      />
      <FieldBoundary
        position={[FIELD_WIDTH / 2 + 1, BOUNDARY_HEIGHT / 2, 0]}
        size={[2, BOUNDARY_HEIGHT, FIELD_LENGTH + 2]}
      />

      <Text position={[0, 5, -10]} fontSize={1} color="#ffffff" anchorX="center" anchorY="middle">
        {playerName} vs {opponentName}
      </Text>

      <GoalMessage isVisible={isGoal} />
      <Scoreboard homeScore={homeScore} awayScore={awayScore} />
    </Physics>
  )
}

