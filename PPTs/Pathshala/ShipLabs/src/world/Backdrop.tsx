import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import { SLIDE_META } from '../slides/meta';
import { PARTS } from '../config';
import { reducedMotion } from '../engine/StepEngine';

// The one persistent 3D canvas behind every slide: a slow field of "code dust" and a
// wireframe hull. Each slide change dollies the camera to a new pose and re-tints the
// hull to the current part, so the deck still feels like one continuous flight.

const N = 1400;

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 34;
      p[i * 3 + 2] = -Math.random() * 40;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current && !reducedMotion()) ref.current.rotation.y += dt * 0.008;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} color="#cfc6b2" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Hull() {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(6, 1)), []);
  const ring = useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(9, 0.02, 3, 96)), []);
  const target = useMemo(() => new THREE.Color(), []);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const { slideIndex } = useStore.getState();
    target.set(PARTS[SLIDE_META[slideIndex]?.part ?? 'intro'].color);
    mat.current?.color.lerp(target, 1 - Math.exp(-dt * 2));
    if (reducedMotion()) return;
    g.rotation.y += dt * 0.05;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });
  return (
    <group ref={ref} position={[10, 0, -20]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={mat} transparent opacity={0.13} />
      </lineSegments>
      <lineSegments geometry={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <lineBasicMaterial color="#e3b341" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

/** Per-slide camera pose: a gentle drift so every slide change reads as movement. */
function Rig() {
  const look = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, pointer }, dt) => {
    const i = useStore.getState().slideIndex;
    goal.set(Math.sin(i * 0.9) * 3 + pointer.x * 0.4, Math.cos(i * 0.7) * 1.5 + pointer.y * 0.3, 14 - (i % 3));
    const k = reducedMotion() ? 1 : 1 - Math.exp(-dt * 1.6);
    camera.position.lerp(goal, k);
    look.lerp(new THREE.Vector3(Math.sin(i * 0.9) * 1.5, 0, -10), k);
    camera.lookAt(look);
  });
  return null;
}

export function Backdrop() {
  return (
    <Canvas
      className="backdrop"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 50, position: [0, 0, 14] }}
    >
      <color attach="background" args={['#0b0b0d']} />
      <fog attach="fog" args={['#0b0b0d', 12, 46]} />
      <Dust />
      <Hull />
      <Rig />
    </Canvas>
  );
}
