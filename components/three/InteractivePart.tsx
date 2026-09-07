/* eslint-disable react/react-compiler -- R3F owns mutable Three.js objects; render-loop transforms and material changes intentionally use its imperative API. */
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import type { AtlasPart } from '@/lib/atlas/types';
import { PartGeometry } from './PartGeometry';

export function InteractivePart({
  part,
  selected,
  dimmed,
  hidden,
  exploded,
  xray,
  labels,
  onSelect,
  reducedMotion = false,
  preview = false,
}: {
  part: AtlasPart;
  selected: boolean;
  dimmed: boolean;
  hidden: boolean;
  exploded: number;
  xray: boolean;
  labels: boolean;
  onSelect: (id: string) => void;
  reducedMotion?: boolean;
  preview?: boolean;
}) {
  const group = useRef<Group>(null);
  const materials = useRef<MeshStandardMaterial[]>([]);
  const [hovered, setHovered] = useState(false);
  const target = useRef(new Vector3());
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    materials.current = [];
    group.current?.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        materials.current.push(object.material);
        object.material.transparent = true;
      }
    });
  }, [part]);
  useEffect(
    () => () => {
      document.body.style.cursor = '';
    },
    [],
  );
  useEffect(() => {
    if (hidden || (xray && part.geometry === 'case')) {
      setHovered(false);
      document.body.style.cursor = '';
    }
  }, [hidden, xray, part.geometry]);
  useFrame((_, dt) => {
    if (!group.current) return;
    target.current.set(
      part.position[0] +
        (part.explodedPosition[0] - part.position[0]) * exploded,
      part.position[1] +
        (part.explodedPosition[1] - part.position[1]) * exploded,
      part.position[2] +
        (part.explodedPosition[2] - part.position[2]) * exploded,
    );
    const factor = reducedMotion ? 1 : 1 - Math.exp(-7 * Math.min(dt, 0.1));
    group.current.position.lerp(target.current, factor);
    const opacity =
      part.geometry === 'case' && xray ? 0.075 : dimmed ? 0.22 : 1;
    let animating =
      group.current.position.distanceToSquared(target.current) > 0.00001;
    for (const material of materials.current) {
      material.opacity = MathUtils.lerp(material.opacity, opacity, factor);
      animating ||= Math.abs(material.opacity - opacity) > 0.001;
      material.depthWrite = material.opacity > 0.85;
      material.emissive.set(
        selected ? '#367ad3' : hovered ? '#49688b' : '#000000',
      );
      material.emissiveIntensity = selected ? 0.4 : hovered ? 0.22 : 0;
    }
    if (animating) invalidate();
  });
  const over = (event: ThreeEvent<PointerEvent>) => {
    if (hidden || preview || (xray && part.geometry === 'case')) return;
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  return (
    <group
      ref={group}
      name={part.modelObjectName}
      position={part.position}
      visible={!hidden}
      onPointerOver={over}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
      onClick={(event) => {
        if (hidden || preview || (xray && part.geometry === 'case')) return;
        event.stopPropagation();
        if (event.delta < 5) onSelect(part.id);
      }}
    >
      <group rotation={part.rotation}>
        <PartGeometry part={part} />
      </group>
      {!preview && !hidden && (hovered || selected || labels) && (
        <Html
          position={[0, part.size[1] / 2 + 0.17, 0.15]}
          center
          distanceFactor={8}
          style={{ pointerEvents: 'none' }}
        >
          <span className={`component-label ${selected ? 'selected' : ''}`}>
            {selected && <i />}
            {part.name}
          </span>
        </Html>
      )}
    </group>
  );
}
