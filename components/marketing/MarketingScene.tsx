'use client';
/* eslint-disable react/react-compiler -- R3F owns these mutable camera and renderer objects. */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box3, Group, PerspectiveCamera, Sphere, Vector3, MOUSE, TOUCH } from 'three';
import type { OrbitControls as Controls } from 'three-stdlib';
import { systems } from '@/lib/atlas/systems';
import type { SystemId } from '@/lib/atlas/types';
import { PartGeometry } from '@/components/three/PartGeometry';
import { StudioLighting } from '@/components/three/StudioLighting';
import styles from './marketing.module.css';

function ModelStage({ systemId, onDragging }: { systemId: SystemId; onDragging: (value: boolean) => void }) {
  const model = useRef<Group>(null);
  const controls = useRef<Controls>(null);
  const { camera, size, gl, invalidate } = useThree();
  const system = systems[systemId];
  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y';
  }, [gl]);
  useLayoutEffect(() => {
    if (!model.current || !controls.current) return;
    model.current.position.set(0, 0, 0);
    model.current.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(model.current);
    const sphere = bounds.getBoundingSphere(new Sphere());
    model.current.position.copy(sphere.center).negate();
    const perspective = camera as PerspectiveCamera;
    const vertical = perspective.fov * Math.PI / 360;
    const horizontal = Math.atan(Math.tan(vertical) * size.width / Math.max(1, size.height));
    // A sphere fits at every rotation, including the allowed polar extremes.
    const distance = sphere.radius * 1.12 / Math.sin(Math.min(vertical, horizontal));
    camera.position.copy(new Vector3(...system.camera).normalize().multiplyScalar(distance));
    perspective.near = Math.max(0.01, distance / 100);
    perspective.far = distance + sphere.radius * 6;
    perspective.updateProjectionMatrix();
    controls.current.target.set(0, 0, 0);
    controls.current.update();
    gl.domElement.style.touchAction = 'pan-y';
    invalidate();
  }, [camera, gl, invalidate, size.width, size.height, system]);
  return <>
    <group ref={model}>{system.parts.map(part => <group key={part.id} position={part.position} rotation={part.rotation}><PartGeometry part={part} /></group>)}</group>
    <OrbitControls ref={controls} makeDefault enableRotate enableZoom={false} enablePan={false}
      enableDamping dampingFactor={0.09} rotateSpeed={0.45} autoRotate={false}
      minPolarAngle={Math.PI * 0.15} maxPolarAngle={Math.PI * 0.75}
      mouseButtons={{ LEFT: MOUSE.ROTATE }} touches={{ ONE: TOUCH.ROTATE }}
      onStart={() => onDragging(true)} onEnd={() => onDragging(false)} />
  </>;
}

export default function MarketingScene({ systemId }: { systemId: SystemId }) {
  const [dragging, setDragging] = useState(false);
  return <div className={styles.marketingStage} style={{ width: '100%', height: '100%', cursor: dragging ? 'grabbing' : 'grab' }}>
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 38 }} gl={{ alpha: true, antialias: true }}
      fallback={<p>3D preview is unavailable. Launch Atlas to explore the component information.</p>}>
      <StudioLighting /><ambientLight intensity={0.6} />
      <hemisphereLight args={['#d5e0eb', '#333037', 0.8]} />
      <directionalLight position={[4, 7, 6]} intensity={2.8} />
      <directionalLight position={[-5, 2, -3]} intensity={1.8} color="#b8cce0" />
      <ModelStage key={systemId} systemId={systemId} onDragging={setDragging} />
    </Canvas>
  </div>;
}
