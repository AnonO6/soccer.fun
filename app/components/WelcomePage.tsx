"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WelcomePageProps {
  onStart: (playerName: string) => void
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  const [playerName, setPlayerName] = useState("")

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName.trim())
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-600">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Welcome to soccer.fun</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium text-gray-700">
              Enter your name
            </Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!playerName.trim()}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  )
}

