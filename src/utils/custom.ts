import * as THREE from 'three'
import { DynamicInstMesh } from './types';

export const generateHeight = (width: number, depth: number, minHeight: number, maxHeight: number) => {
  // Generates the height data (a sine wave)
  const size = width * depth;
  const data = new Float32Array(size);
  const hRange = maxHeight - minHeight;
  const w2 = width / 2;
  const d2 = depth / 2;
  const phaseMult = 12;
  let p = 0;

  for (let j = 0; j < depth; j++) {
    for (let i = 0; i < width; i++) {
      const radius = Math.sqrt(
        Math.pow((i - w2) / w2, 2.0) +
        Math.pow((j - d2) / d2, 2.0));
      const height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
      data[p] = height;
      p++;
    }
  }

  return data;
}

export const getStlMesh = (geometry: any, material: THREE.MeshPhongMaterial, cnt: number = 1): DynamicInstMesh => {
  if (cnt < 1) cnt = 1
  let rawGeometry = geometry
  if (geometry.isBufferGeometry) {
    rawGeometry = new THREE.Geometry().fromBufferGeometry(geometry)
  }
  const instStlMesh = new DynamicInstMesh(rawGeometry, material, cnt)
  return instStlMesh
}
