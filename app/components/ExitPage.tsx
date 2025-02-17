"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { Dispatch, SetStateAction } from "react";

type GameState = "ended" | "playing" | "landing";
interface ExitPageProps {
  winner: string
  player1: string
  player2: string
  score: [number, number]
  gameSetter: Dispatch<SetStateAction<GameState>>;
}

// If your file is in the public folder, reference it with a leading slash:
const AUDIO_SOURCES = [
  { src: "/constants/success.wav" , type: "audio/wav" },
]

// Alternatively, if you prefer to import the file (and have your bundler handle it), you can:
// import victorySound from "app/constants/victory.mp3"
// const AUDIO_SOURCES = [{ src: victorySound, type: "audio/mpeg" }];

export function ExitPage({ winner, player1, player2, score, gameSetter }: ExitPageProps) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleCanPlayThrough = () => {
      setAudioLoaded(true)
      audio.loop = true
      audio.volume = 0.5
      audio
        .play()
        .catch((err) => {
          console.error("Autoplay failed, waiting for user interaction:", err)
          setAudioError("Audio playback requires user interaction.")
        })
    }

    const handleError = () => {
      console.error("Error loading audio")
      setAudioError("Couldn't load the victory sound. The game will continue without music.")
    }

    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("error", handleError)

    // Append sources
    AUDIO_SOURCES.forEach((source) => {
      const sourceElement = document.createElement("source")
      sourceElement.src = source.src
      sourceElement.type = source.type
      audio.appendChild(sourceElement)
    })

    audio.load()

    // Listen for user interaction in case autoplay was blocked
    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setAudioError(null)
          })
          .catch((err) => {
            console.error("Error playing audio after user interaction:", err)
          })
      }
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }

    window.addEventListener("click", handleUserInteraction)
    window.addEventListener("keydown", handleUserInteraction)

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("error", handleError)
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (audioError) {
      Toast({
        title: "Audio Error",
        variant: "destructive",
      })
    }
  }, [audioError])

  const handlePlayAgain = () => {
    gameSetter("landing");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 font-pixel">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full text-center border-4 border-neon-blue pixel-border">
        <h1 className="text-4xl mb-6 text-neon-yellow glow">Game Over!</h1>
        <div className="flex justify-between mb-8">
          <div className="text-left">
            <h2 className="text-2xl text-neon-green">{player1}</h2>
            <p className="text-3xl">{score[0]}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl text-neon-green">{player2}</h2>
            <p className="text-3xl">{score[1]}</p>
          </div>
        </div>
        <h3 className="text-3xl mb-6 text-neon-purple">
          {winner === "draw" ? "It's a draw!" : `${winner} wins!`}
        </h3>
        <Button
          onClick={handlePlayAgain}
          className="bg-neon-yellow hover:bg-neon-yellow-bright text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline pixel-button"
        >
          Play Again
        </Button>
      </div>
      {!audioLoaded && !audioError && (
        <p className="mt-4 text-neon-blue">Loading victory sound...</p>
      )}
      {audioError && (
        <p className="mt-4 text-neon-red">Audio unavailable</p>
      )}
    </div>
  )
}
