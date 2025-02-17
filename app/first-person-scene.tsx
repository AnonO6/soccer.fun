"use client"

import { Canvas } from "@react-three/fiber"
import { PointerLockControls } from "@react-three/drei"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditsDialog } from "./components/ui/credits-dialog"
import { Scene } from "./components/3d/Scene"
import { PixelLandingPage } from "./components/PixelLandingPage"
import { ExitPage } from "./components/ExitPage"
import { Toaster } from "@/components/ui/toaster"

export default function FirstPersonScene() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [opponentName, setOpponentName] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<'landing' | 'playing' | 'ended'>('landing')
  const [winner, setWinner] = useState<string | null>(null)
  const [finalScore, setFinalScore] = useState<[number, number] | null>(null)

  const handleCreditsClick = () => {
    setIsCreditsOpen(true)
  }

  const handleGameStart = (name: string, room: string | null) => {
    setPlayerName(name)
    setRoomId(room)
    setOpponentName("AI Opponent") // For now, we'll use an AI opponent
    setGameState('playing')
  }

  const handleGameEnd = (winner: string, player1: string, player2: string, score: [number, number]) => {
    setWinner(winner)
    setFinalScore(score)
    setGameState('ended')
  }

  if (gameState === 'landing') {
    return <PixelLandingPage onStart={handleGameStart} />
  }

  if (gameState === 'ended') {
    return (
      <>
        <ExitPage
          winner={winner!}
          player1={playerName!}
          player2={opponentName!}
          score={finalScore!}
          gameSetter={setGameState}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="w-full h-screen">
      <Canvas id="canvas" shadows camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 10] }}>
        <Scene playerName={playerName!} opponentName={opponentName!} onGameEnd={handleGameEnd} />
        <PointerLockControls selector="#canvas" />
      </Canvas>
      <div className="fixed bottom-4 right-4 z-10">
        <Button
          variant="outline"
          className="bg-black text-white hover:bg-gray-800 hover:text-white transition-all duration-200 border-0"
          onClick={handleCreditsClick}
        >
          Credits
        </Button>
      </div>
      <CreditsDialog isOpen={isCreditsOpen} onOpenChange={(open) => setIsCreditsOpen(open)} />
      <Toaster />
    </div>
  )
}

