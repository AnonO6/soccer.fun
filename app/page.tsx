import FirstPersonScene from "./first-person-scene"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "soccer.fun - 3D Soccer Experience",
  description: "An immersive 3D soccer game experience",
}

export default function Home() {
  return (
    <>
      <FirstPersonScene />
      <Toaster />
    </>
  )
}

