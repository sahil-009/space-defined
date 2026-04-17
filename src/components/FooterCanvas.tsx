import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

// ─── Floating Gem ─────────────────────────────────────────────────────────────
function FloatingGem() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow auto-rotation
    meshRef.current.rotation.y += delta * 0.28;
    meshRef.current.rotation.x += delta * 0.12;

    // Subtle cursor response
    meshRef.current.rotation.x +=
      (mouseRef.current.y * 0.18 - meshRef.current.rotation.x) * 0.04;
    meshRef.current.rotation.z +=
      (mouseRef.current.x * 0.12 - meshRef.current.rotation.z) * 0.04;
  });

  // Scale based on canvas size
  const scale = Math.min(size.width, size.height) / 260;

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={scale}>
        {/* Low-poly torusKnot — beautiful & lightweight */}
        <torusKnotGeometry args={[1, 0.32, 96, 12, 2, 3]} />
        <MeshDistortMaterial
          color="#8C5A3C"
          emissive="#3a1e10"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          distort={0.18}
          speed={1.5}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

// ─── Canvas wrapper (lazy loaded) ────────────────────────────────────────────
const FooterCanvas = () => (
  <Canvas
    camera={{ position: [0, 0, 4.5], fov: 42 }}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    dpr={[1, 1.5]}
    style={{ background: "transparent" }}
  >
    {/* Lights */}
    <ambientLight intensity={0.3} />
    <directionalLight position={[3, 5, 2]} intensity={1.2} color="#fff5ee" />
    <pointLight position={[-3, -2, -3]} intensity={0.5} color="#1a2a4a" />
    <pointLight position={[0, 0, 3]} intensity={0.4} color="#8C5A3C" />

    <FloatingGem />
  </Canvas>
);

export default FooterCanvas;
