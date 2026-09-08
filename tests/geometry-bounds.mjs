import {
  Box3,
  BoxGeometry,
  CylinderGeometry,
  TorusGeometry,
  ExtrudeGeometry,
  RingGeometry,
  PlaneGeometry,
  TubeGeometry,
  Matrix4,
  Euler,
  Vector3,
} from 'three';

// Evaluate the actual React geometry tree, including nested transforms.
export function bounds(element, parent = new Matrix4(), box = new Box3()) {
  if (!element || typeof element !== 'object') return box;
  if (Array.isArray(element)) {
    element.forEach((e) => bounds(e, parent, box));
    return box;
  }
  const { type, props } = element;
  if (typeof type === 'function') return bounds(type(props), parent, box);
  if (!props) return box;
  const local = new Matrix4().makeRotationFromEuler(
    new Euler(...(props.rotation ?? [0, 0, 0])),
  );
  const scale =
    typeof props.scale === 'number'
      ? [props.scale, props.scale, props.scale]
      : (props.scale ?? [1, 1, 1]);
  local.scale(new Vector3(...scale));
  local.setPosition(...(props.position ?? [0, 0, 0]));
  const matrix = parent.clone().multiply(local);
  const constructors = {
    boxGeometry: BoxGeometry,
    cylinderGeometry: CylinderGeometry,
    torusGeometry: TorusGeometry,
    extrudeGeometry: ExtrudeGeometry,
    ringGeometry: RingGeometry,
    planeGeometry: PlaneGeometry,
    tubeGeometry: TubeGeometry,
  };
  if (type === 'primitive' && props.object?.isBufferGeometry) {
    props.object.computeBoundingBox();
    box.union(props.object.boundingBox.clone().applyMatrix4(matrix));
  } else if (constructors[type]) {
    const geometry = new constructors[type](...(props.args ?? []));
    geometry.computeBoundingBox();
    box.union(geometry.boundingBox.clone().applyMatrix4(matrix));
    geometry.dispose();
  } else if (typeof type === 'string' && type.endsWith('Geometry'))
    throw new Error(`Untested geometry: ${type}`);
  return bounds(props.children, matrix, box);
}
