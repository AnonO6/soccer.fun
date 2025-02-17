"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Vector3, RepeatWrapping } from "three";
import { Geometry } from "three-stdlib";
import {
  PointerLockControls,
  Plane,
  useTexture,
  useGLTF,
  Environment,
} from "@react-three/drei";
import {
  Physics,
  usePlane,
  useSphere,
} from "@react-three/cannon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TEXTURES = {
  ground: {
    colorMap:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snow007A_1K-JPG_Color-fqUbdtaLLo50sIQcICJwHUWJGdgjyI.jpg",
    displacementMap:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snow007A_1K-JPG_Displacement-w54QlVObPwnSh9THsIJMigUmExq1G7.jpg",
    normalMap:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snow007A_1K-JPG_NormalGL-WnjEjuR897euo20HyItfUbgxRaR5Sl.jpg",
    roughnessMap:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snow007A_1K-JPG_Roughness-N0xEA5cs65MfGnR8ictjHVuObjCcgs.jpg",
    aoMap:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snow007A_1K-JPG_AmbientOcclusion-oOddkNLnaJt3y0QWhUrECeBIYwmLpe.jpg",
  },
};

const MODELS = {
  soccerBall:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soccer_ball%20(3)-WwKpUbAGistdeknz1f7rcJhlRYUIU4.glb",
};

const SOUNDS = {
  ballHit:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mixkit-hitting-soccer-ball-2112-WDrmmZYGqLD4m3DbdnjqvlFdSUbthv.wav",
};

const usePlayerControls = () => {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.backward = true;
          break;
        case "KeyA":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "Space":
          keys.current.jump = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = true;
          break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
          keys.current.forward = false;
          break;
        case "KeyS":
          keys.current.backward = false;
          break;
        case "KeyA":
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
        case "Space":
          keys.current.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.shift = false;
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
};

function Player({ position = [0, 10, 0] }) {
  const direction = new Vector3();
  const frontVector = new Vector3();
  const sideVector = new Vector3();
  const WALK_SPEED = 15;
  const RUN_SPEED = 25;
  const JUMP_FORCE = 25;
  const PLAYER_HEIGHT = 1.8;
  const SPHERE_RADIUS = 0.3;
  const INITIAL_CAMERA_TILT = 0.15;

  const { camera } = useThree();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0,10,0],
    args: [SPHERE_RADIUS],
    linearDamping: 0.1,
    fixedRotation: true,
  }));

  const playerControls = usePlayerControls();
  const velocity = useRef([0, 0, 0]);
  const isGrounded = useRef(false);

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => {
      camera.position.set(p[0], p[1] + PLAYER_HEIGHT - SPHERE_RADIUS, p[2]);
    });

    camera.rotation.x = INITIAL_CAMERA_TILT;
  }, [api.velocity, api.position, camera]);

  useFrame((state) => {
    frontVector.set(
      0,
      0,
      Number(playerControls.current.backward) -
        Number(playerControls.current.forward)
    );
    sideVector.set(
      Number(playerControls.current.left) -
        Number(playerControls.current.right),
      0,
      0
    );
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(playerControls.current.shift ? RUN_SPEED : WALK_SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    isGrounded.current = Math.abs(velocity.current[1]) < 0.1;

    if (playerControls.current.jump && isGrounded.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    if (!isGrounded.current) {
      api.applyForce([0, -9.8 * 3, 0], [0, 0, 0]);
    }
  });

  return <mesh ref={ref} castShadow receiveShadow />;
}

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    friction: 0.5,
    restitution: 0,
  }));

  const textures = useTexture(TEXTURES.ground, (textures) => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(3000, 3000);
    });
  });

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
  );
}

const SoccerBall = React.memo(() => {
  const { scene } = useGLTF(MODELS.soccerBall);
  const [ref, api] = useSphere(() => ({
    mass: 0.2,
    position: [0, 0.6, -5],
    args: [0.6],
    friction: 0.1,
    restitution: 0.8,
    linearDamping: 0.1,
    angularDamping: 0.1,
    onCollide: handleCollision,
  }));

  const sound = useRef(new Audio(SOUNDS.ballHit));
  const lastCollisionTime = useRef(0);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [scene]);

  function handleCollision() {
    const currentTime = Date.now();
    if (
      hasInteracted.current &&
      currentTime - lastCollisionTime.current > 100
    ) {
      sound.current.currentTime = 0;
      sound.current.play();
      lastCollisionTime.current = currentTime;
    }
  }

  useFrame(() => {
    api.position.subscribe((position) => {
      if (position[1] < -100) {
        api.position.set(0, 10, -5);
        api.velocity.set(0, 0, 0);
      }
    });
  });

  return <primitive ref={ref} object={scene.clone()} scale={[0.6, 0.6, 0.6]} />;
});

SoccerBall.displayName = "SoccerBall";


function scaleGeometry(geometry, scaleX, scaleY, scaleZ) {
  geometry.vertices.forEach((vertex) => {
    vertex.x *= scaleX;
    vertex.y *= scaleY;
    vertex.z *= scaleZ;
  });

  geometry.verticesNeedUpdate = true;
}


function toConvexProps(bufferGeometry, scale = 1) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  scaleGeometry(geo, scale, scale, scale);
  geo.mergeVertices();
  return [
    geo.vertices.map((v) => [v.x, v.y, v.z]),
    geo.faces.map((f) => [f.a, f.b, f.c]),
    [],
  ];
}

function Scene() {
  return (
    <Physics gravity={[0, -9.8, 0]}>
      <Environment
        files="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/M3_Drone_Shot_equirectangular-jpg_beautiful_colorful_aurora_borealis_1590129447_11909016%20(1)%20(1)-wZt8kjPRcukoLvG8o8jpg7XjTYEAMX.jpg"
        background
        blur={0}
      />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Player />
      <Ground />
      <SoccerBall />
    </Physics>
  );
}

const CREDITS = [
  { title: "CREATED BY AVIRAL SHUKLA", url: "https://aviral.software" },
  {
    title: "Soccer Ball",
    url: "https://sketchfab.com/3d-models/soccer-ball-46c91864ef384158b0078e20bdbfe3e9",
  },
  {
    title: "Hitting Soccer Ball",
    url: "https://mixkit.co/free-sound-effects/ball",
  },
];

function CreditsDialog({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Credits
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {CREDITS.map((credit, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-1">{credit.title}</h3>
              <p className="text-sm text-gray-300 break-all">{credit.url}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BasicFirstPersonControls() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const handleCreditsClick = () => {
    setIsCreditsOpen(true);
  };

  return (
    <div className="w-full h-screen">
      <Canvas id="canvas" shadows camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <Scene />
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
      <CreditsDialog
        isOpen={isCreditsOpen}
        onOpenChange={(open) => setIsCreditsOpen(open)}
      />
    </div>
  );
}
