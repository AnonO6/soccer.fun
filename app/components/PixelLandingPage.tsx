"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toast } from "@/components/ui/toast"

interface PixelLandingPageProps {
  onStart: (playerName: string, roomId: string | null) => void
}

export function PixelLandingPage({ onStart }: PixelLandingPageProps) {
  const [playerName, setPlayerName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(true)
  const [generatedRoomId, setGeneratedRoomId] = useState("")

  useEffect(() => {
    if (isCreatingRoom) {
      generateRoomId()
    }
  }, [isCreatingRoom])

  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedRoomId(newRoomId)
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(generatedRoomId)
    Toast({
      title: "Room ID Copied!",
    })
  }

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName.trim(), isCreatingRoom ? generatedRoomId : roomId.trim())
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-arcade-pattern bg-repeat">
      <div className="p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl w-full max-w-md border-4 border-neon-blue pixel-border">
        <h1 className="text-4xl font-bold text-center mb-6 text-neon-yellow pixel-text glow">soccer.fun</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium text-neon-green pixel-text">
              Enter your funky name
            </Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Cool Cat"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-neon-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow pixel-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomAction" className="text-sm font-medium text-neon-green pixel-text">
              Choose your destiny
            </Label>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsCreatingRoom(true)}
                className={`flex-1 pixel-button ${isCreatingRoom ? "bg-neon-green" : "bg-gray-600"}`}
              >
                Create Room
              </Button>
              <Button
                onClick={() => setIsCreatingRoom(false)}
                className={`flex-1 pixel-button ${!isCreatingRoom ? "bg-neon-blue" : "bg-gray-600"}`}
              >
                Join Room
              </Button>
            </div>
          </div>
          {isCreatingRoom ? (
            <div className="space-y-2">
              <Label htmlFor="generatedRoomId" className="text-sm font-medium text-neon-green pixel-text">
                Your Room ID
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="generatedRoomId"
                  type="text"
                  value={generatedRoomId}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-700 border border-neon-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow pixel-input"
                />
                <Button onClick={copyRoomId} className="pixel-button bg-neon-purple">
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="roomId" className="text-sm font-medium text-neon-green pixel-text">
                Enter Room ID
              </Label>
              <Input
                id="roomId"
                type="text"
                placeholder="COOL123"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-neon-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow pixel-input"
              />
            </div>
          )}
          <Button
            onClick={handleStart}
            className="w-full bg-neon-yellow hover:bg-neon-yellow-bright text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline pixel-button"
            disabled={!playerName.trim() || (!isCreatingRoom && !roomId.trim())}
          >
            {isCreatingRoom ? "Create Awesome Room" : "Join Epic Game"}
          </Button>
        </div>
      </div>
    </div>
  )
}

