import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

function Orb() {
  const group = useRef<Group>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i += 1) {
      // Deterministic distribution: no hydration jitter or frame allocations.
      const theta = i * 2.399963229728653;
      const y = 1 - (2 * (i + 0.5)) / 360;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const distance = 2.6 + (i % 7) * 0.14;
      values[i * 3] = Math.cos(theta) * r * distance;
      values[i * 3 + 1] = y * distance;
      values[i * 3 + 2] = Math.sin(theta) * r * distance;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const step = Math.min(delta, 0.05);
    group.current.rotation.y += step * 0.085;
    // Subtle physically smoothed pointer response, only on WebGL-capable desktop.
    const targetX = Math.sin(state.clock.elapsedTime * 0.12) * 0.07 + state.pointer.y * -0.18;
    const targetZ = Math.sin(state.clock.elapsedTime * 0.14) * 0.07 + state.pointer.x * 0.16;
    const damping = 1 - Math.exp(-Math.min(delta, 0.05) * 3.5);
    group.current.rotation.x += (targetX - group.current.rotation.x) * damping;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * damping;
  });

  return (
    <group ref={group}>
      <mesh rotation={[0.28, 0.18, 0]}>
        <icosahedronGeometry args={[1.46, 2]} />
        <meshStandardMaterial color="#0e2347" metalness={0.82} roughness={0.22} flatShading />
      </mesh>
      <mesh rotation={[0.28, 0.18, 0]} scale={1.005}>
        <icosahedronGeometry args={[1.46, 2]} />
        <meshBasicMaterial wireframe transparent opacity={0.26} color="#8ccfff" />
      </mesh>
      <mesh rotation={[0.65, 0.1, 0.2]}>
        <torusGeometry args={[2.03, 0.012, 8, 160]} />
        <meshBasicMaterial color="#95dbfa" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[1.18, 0.3, 0.48]}>
        <torusGeometry args={[2.35, 0.007, 8, 160]} />
        <meshBasicMaterial color="#b9a6ff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0.1, 1, 0.85]}>
        <torusGeometry args={[1.92, 0.006, 8, 160]} />
        <meshBasicMaterial color="#e5cfa6" transparent opacity={0.62} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#a9dff5" size={0.017} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
      </points>
    </group>
  );
}

export default function CosmicOrb() {
  return (
    <Canvas
      className="cinema-orb-canvas"
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
      aria-label="A slowly rotating interactive celestial sculpture"
    >
      <ambientLight intensity={1.5} color="#80a9ff" />
      <pointLight color="#8ceaff" position={[4, 4, 5]} intensity={22} distance={16} />
      <pointLight color="#d1a6ff" position={[-3, -4, 1]} intensity={12} distance={13} />
      <Orb />
    </Canvas>
  );
}
