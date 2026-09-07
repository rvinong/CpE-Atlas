import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import type { AtlasSystem } from '@/lib/atlas/types';

export function CameraController({
  system,
  selectedId,
  exploded,
  resetKey,
  reducedMotion,
  preview = false,
}: {
  system: AtlasSystem;
  selectedId: string | null;
  exploded: number;
  resetKey: number;
  reducedMotion: boolean;
  preview?: boolean;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const goal = useRef(new Vector3(...system.camera));
  const target = useRef(new Vector3());
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const part = system.parts.find((p) => p.id === selectedId);
    const framing = Math.max(
      1,
      (system.id === 'rectifier' ? 1.25 : 0.8) / aspect,
    );
    if (part) {
      target.current
        .set(...part.cameraTarget)
        .lerp(new Vector3(...part.explodedPosition), exploded);
      const distance =
        Math.max(3.4, Math.max(...part.size) * 1.9) * Math.max(1, 0.8 / aspect);
      goal.current
        .copy(target.current)
        .add(new Vector3(0.8, 0.5, 1.5).normalize().multiplyScalar(distance));
    } else {
      target.current.set(0, 0, 0);
      goal.current
        .set(...system.camera)
        .multiplyScalar((1 + exploded * 0.33) * framing);
    }
    moving.current = true;
  }, [system, selectedId, exploded, resetKey, aspect]);
  useFrame(({ camera }, dt) => {
    if (!moving.current || !controls.current) return;
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-4.2 * Math.min(dt, 0.1));
    camera.position.lerp(goal.current, alpha);
    controls.current.target.lerp(target.current, alpha);
    controls.current.update();
    invalidate();
    if (
      camera.position.distanceTo(goal.current) < 0.012 &&
      controls.current.target.distanceTo(target.current) < 0.012
    )
      moving.current = false;
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.09}
      enablePan={false}
      minDistance={2}
      maxDistance={35}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI - 0.12}
      rotateSpeed={0.6}
      zoomSpeed={0.75}
      autoRotate={preview && !reducedMotion}
      autoRotateSpeed={0.3}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}
