/* eslint-disable react/react-compiler -- R3F owns mutable Three.js objects; render-loop transforms and material changes intentionally use its imperative API. */
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  Euler,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three';
import {
  displayProgress,
  partPosition,
  type DisplaySlot,
} from '@/lib/atlas/explosion';
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
  displaySlot,
  progress,
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
  displaySlot?: DisplaySlot;
  progress?: RefObject<number>;
}) {
  const group = useRef<Group>(null);
  const materials = useRef<
    { material: MeshStandardMaterial; baseOpacity: number }[]
  >([]);
  const [hovered, setHovered] = useState(false);
  const target = useRef(new Vector3());
  const geometry = useRef<Group>(null);
  const rotationTarget = useRef(new Quaternion());
  const rotationStart = useRef(new Quaternion());
  const caption = useRef<HTMLSpanElement>(null);
  const invalidate = useThree((s) => s.invalidate);
  const canvasHeight = useThree((s) => s.size.height);
  useEffect(() => {
    materials.current = [];
    group.current?.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        materials.current.push({
          material: object.material,
          baseOpacity: object.material.opacity,
        });
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
    const amount = progress?.current ?? exploded;
    target.current.set(...partPosition(part, amount, displaySlot));
    if (caption.current)
      caption.current.style.visibility =
        displaySlot && !hovered && !selected && !labels && amount < 0.97
          ? 'hidden'
          : 'visible';
    const factor = reducedMotion ? 1 : 1 - Math.exp(-7 * Math.min(dt, 0.1));
    group.current.position.lerp(target.current, factor);
    const opacity =
      part.geometry === 'case' && xray ? 0.075 : dimmed ? 0.22 : 1;
    let animating =
      group.current.position.distanceToSquared(target.current) > 0.00001;
    if (geometry.current) {
      rotationStart.current.setFromEuler(
        new Euler(...(part.rotation ?? [0, 0, 0])),
      );
      rotationTarget.current.setFromEuler(
        new Euler(...(displaySlot?.rotation ?? part.rotation ?? [0, 0, 0])),
      );
      rotationStart.current.slerp(
        rotationTarget.current,
        displaySlot ? displayProgress(amount) : 0,
      );
      geometry.current.quaternion.slerp(rotationStart.current, factor);
      animating ||=
        geometry.current.quaternion.angleTo(rotationStart.current) > 0.001;
    }
    for (const { material, baseOpacity } of materials.current) {
      const targetOpacity = opacity * baseOpacity;
      material.opacity = MathUtils.lerp(
        material.opacity,
        targetOpacity,
        factor,
      );
      animating ||= Math.abs(material.opacity - targetOpacity) > 0.001;
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
      <group ref={geometry} rotation={part.rotation}>
        <PartGeometry part={part} />
      </group>
      {!preview &&
        !hidden &&
        (hovered ||
          selected ||
          labels ||
          (!!displaySlot && exploded > 0.96)) && (
          <Html
            position={
              displaySlot && exploded > 0.96
                ? [0, -displaySlot.size[1] / 2 - 0.25, displaySlot.size[2] / 2]
                : [0, part.size[1] / 2 + 0.17, 0.15]
            }
            center
            distanceFactor={
              displaySlot && exploded > 0.96 ? canvasHeight / 75 : 8
            }
            style={{ pointerEvents: 'none' }}
          >
            <span
              ref={caption}
              className={`component-label ${selected ? 'selected' : ''} ${displaySlot && exploded > 0.96 ? 'catalog-label' : ''}`}
            >
              {selected && <i />}
              {part.name}
              {displaySlot && exploded > 0.96 && (
                <small>{part.dimensionsMm}</small>
              )}
            </span>
          </Html>
        )}
    </group>
  );
}
