import { usePlane } from "@react-three/cannon"
import { Plane, useTexture } from "@react-three/drei"
import { RepeatWrapping } from "three"
import { TEXTURES } from "../../constants/textures" // Updated to use relative import

export function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    friction: 0.5,
    restitution: 0,
  }))

  const textures = useTexture(TEXTURES.ground, (textures) => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = RepeatWrapping
      texture.repeat.set(3000, 3000)
    })
  })

  return (
    <Plane ref={ref} args={[10000, 10000]} receiveShadow>
      <meshStandardMaterial
        map={textures.colorMap}
        displacementMap={textures.displacementMap}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        aoMap={textures.aoMap}
        displacementScale={0.2}
        roughness={1}
        metalness={0}
      />
    </Plane>
  )
}

