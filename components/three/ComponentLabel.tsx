import { Html } from '@react-three/drei';
import type { AtlasPart } from '@/lib/atlas/types';
import { rotatedSize, type DisplaySlot } from '@/lib/atlas/explosion';

/** Screen-sized annotations: geometry scale and zoom never enlarge the text. */
export function ComponentLabel({
  part,
  selected,
  exploded,
  displaySlot,
}: {
  part: AtlasPart;
  selected: boolean;
  exploded: number;
  displaySlot?: DisplaySlot;
}) {
  const size =
    exploded > 0.96 && displaySlot
      ? displaySlot.size
      : rotatedSize(part.visualSize ?? part.size, part.rotation ?? [0, 0, 0]);
  return (
    <Html
      position={[0, size[1] / 2 + 0.04, size[2] / 2 + 0.015]}
      center
      zIndexRange={[4, 1]}
      style={{ pointerEvents: 'none' }}
    >
      <span className={`component-label ${selected ? 'selected' : ''}`}>
        <i />
        {part.name}
      </span>
    </Html>
  );
}
