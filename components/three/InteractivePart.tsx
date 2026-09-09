/* eslint-disable react/react-compiler -- R3F owns mutable Three.js objects; render-loop transforms and material changes intentionally use its imperative API. */
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ComponentLabel } from './ComponentLabel';
import {
  Euler,
  Group,
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
import {
  captureAppearance,
  applyAppearance,
  type MaterialAppearance,
} from '@/lib/atlas/material-appearance';

export function InteractivePart({
  part,
  motionSpeed = 0,
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
  motionSpeed?: number;
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
  const motion = useRef<Group>(null);
  const materials = useRef<MaterialAppearance[]>([]);
  const [hovered, setHovered] = useState(false);
  const target = useRef(new Vector3());
  const geometry = useRef<Group>(null);
  const rotationTarget = useRef(new Quaternion());
  const rotationStart = useRef(new Quaternion());
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    materials.current = [];
    group.current?.traverse((object) => {
      if (
        object instanceof Mesh &&
        object.material instanceof MeshStandardMaterial
      ) {
        materials.current.push(captureAppearance(object.material));
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
    const factor = reducedMotion ? 1 : 1 - Math.exp(-7 * Math.min(dt, 0.1));
    group.current.position.lerp(target.current, factor);
    const opacity =
      part.geometry === 'case' && xray ? 0.075 : dimmed ? 0.62 : 1;
    let animating =
      group.current.position.distanceToSquared(target.current) > 0.00001;
    if (!animating) group.current.position.copy(target.current);
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
      if (geometry.current.quaternion.angleTo(rotationStart.current) <= 0.001)
        geometry.current.quaternion.copy(rotationStart.current);
      animating ||=
        geometry.current.quaternion.angleTo(rotationStart.current) > 0.001;
    }
    for (const appearance of materials.current) {
      const changing = applyAppearance(
        appearance,
        opacity,
        factor,
        selected,
        hovered,
      );
      animating ||= changing;
    }
    if (motionSpeed && motion.current) {
      motion.current.rotation.x += motionSpeed * Math.min(dt, 0.1);
      animating = true;
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
        <group ref={motion}>
          <PartGeometry part={part} />
        </group>
      </group>
      {!preview && !hidden && (hovered || selected || labels) && (
        <ComponentLabel
          part={part}
          selected={selected}
          exploded={exploded}
          displaySlot={displaySlot}
        />
      )}
    </group>
  );
}
