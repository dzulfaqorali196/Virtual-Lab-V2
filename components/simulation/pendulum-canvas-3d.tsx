"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { usePendulum } from "@/hooks/use-pendulum"
import { useTheme } from "next-themes"

function PendulumModel() {
  const { length, mass, angle } = usePendulum()
  const { theme } = useTheme()
  const bobRef = useRef()

  const materialColor = theme === "system" || theme === "dark" ? "#ffffff" : "#000000"
  const gridColor = theme === "dark" ? "#666666" : "#999999"

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={theme === "dark" || theme === "system" ? 0.2 : 0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={theme === "dark" || theme === "system" ? 0.5 : 1}
        castShadow
      />
      <spotLight
        position={[0, 5, 0]}
        intensity={theme === "dark" || theme === "system" ? 0.3 : 0.7}
        angle={0.5}
        penumbra={1}
        castShadow
      />

      {/* Pivot Point */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>

      {/* Pendulum Group */}
      <group position={[0, 2, 0]} rotation={[0, 0, angle]}>
        {/* String */}
        <mesh position={[0, -length/2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, length]} />
          <meshStandardMaterial color={materialColor} />
        </mesh>

        {/* Bob */}
        <mesh 
          ref={bobRef as any}
          position={[0, -length, 0]}
        >
          <sphereGeometry args={[mass * 0.2]} />
          <meshStandardMaterial 
            color={materialColor}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Grid Helper */}
      <gridHelper 
        args={[10, 10]} 
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  )
}

export function PendulumCanvas3D() {
  return (
    <div className="w-full h-[400px] bg-background border rounded-lg overflow-hidden">
      <Canvas shadows camera={{ position: [4, 4, 4], fov: 50 }}>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={10}
        />
        <PendulumModel />
      </Canvas>
    </div>
  )
}