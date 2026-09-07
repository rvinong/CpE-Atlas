'use client';
import { Component, Suspense, type ReactNode } from 'react';
import {
  useBrowserReady,
  useReducedMotion,
} from '@/hooks/use-browser-preferences';
import { Canvas } from '@react-three/fiber';
import { RectifierConnections } from './RectifierConnections';
import { LoaderCircle, MonitorX } from 'lucide-react';
import { systems } from '@/lib/atlas/systems';
import { useAtlas } from '@/lib/atlas/store';
import { InteractivePart } from './InteractivePart';
import { CameraController } from './CameraController';

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <output className="scene-fallback">
        <MonitorX size={30} />
        <h3>3D is unavailable on this device.</h3>
        <p>
          You can still explore every component using the list and inspector.
          Try a WebGL-enabled browser for the full experience.
        </p>
      </output>
    ) : (
      this.props.children
    );
  }
}
export function SceneLoading() {
  return (
    <output className="scene-loading">
      <LoaderCircle size={18} />
      Preparing your workspaceâ€¦
    </output>
  );
}
export default function AtlasScene({ preview = false }: { preview?: boolean }) {
  const state = useAtlas();
  const system = systems[preview ? 'desktop' : state.systemId];
  const ready = useBrowserReady();
  const reducedMotion = useReducedMotion();
  const exploded = preview ? 0.28 : state.exploded;
  const selectedId = preview ? null : state.selectedId;
  if (!ready) return <SceneLoading />;
  return (
    <SceneBoundary>
      <Suspense fallback={<SceneLoading />}>
        <Canvas
          frameloop="demand"
          camera={{ position: system.camera, fov: 38, near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          shadows
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onPointerMissed={(event) => {
            if (!preview && event.type === 'click') state.select(null);
          }}
          fallback={
            <div className="scene-fallback">
              3D needs WebGL. Use the component list to explore this system.
            </div>
          }
        >
          <ambientLight intensity={1.2} />
          <hemisphereLight args={['#b8cee8', '#30333a', 1.5]} />
          <directionalLight
            position={[4, 7, 6]}
            intensity={3.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-bias={-0.001}
          />
          <directionalLight
            position={[-5, 2, -3]}
            intensity={3}
            color="#8eafd5"
          />
          <directionalLight position={[0, -2, 5]} intensity={0.7} />
          <group>
            {system.parts.map((part) => (
              <InteractivePart
                key={`${system.id}-${part.id}`}
                part={part}
                selected={selectedId === part.id}
                dimmed={!!selectedId && selectedId !== part.id}
                hidden={!preview && state.isolated && selectedId !== part.id}
                exploded={exploded}
                xray={preview || state.xray}
                labels={!preview && state.labels}
                onSelect={state.select}
                reducedMotion={reducedMotion}
                preview={preview}
              />
            ))}
          </group>
          {system.id === 'rectifier' && exploded < 0.01 && !state.isolated && (
            <RectifierConnections />
          )}
          {!preview && (
            <>
              <gridHelper
                args={[22, 44, '#293540', '#202831']}
                position={[0, -3.15, 0]}
              />
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -3.16, 0]}
                receiveShadow
              >
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.17} />
              </mesh>
            </>
          )}
          <CameraController
            system={system}
            selectedId={selectedId}
            exploded={exploded}
            resetKey={state.resetKey}
            reducedMotion={reducedMotion}
            preview={preview}
          />
        </Canvas>
      </Suspense>
    </SceneBoundary>
  );
}
