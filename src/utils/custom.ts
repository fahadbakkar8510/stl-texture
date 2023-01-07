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

export const getStlMesh = (geometry: any, material: any, cnt: number = 1): DynamicInstMesh => {
  if (cnt < 1) cnt = 1
  let rawGeometry = geometry
  if (geometry.isBufferGeometry) {
    rawGeometry = new THREE.Geometry().fromBufferGeometry(geometry)
  }
  // boxUnwrapUVs(rawGeometry)
  planeUnwrapUVs(rawGeometry)
  console.log('rawGeometry: ', rawGeometry)
  console.log('material: ', material)
  const instStlMesh = new DynamicInstMesh(rawGeometry, material, cnt)
  return instStlMesh
}

export const boxUnwrapUVs = (geometry: any) => {
  for (let i = 0; i < geometry.faces.length; i++) {
    const va = geometry.vertices[geometry.faces[i].a]
    const vb = geometry.vertices[geometry.faces[i].b]
    const vc = geometry.vertices[geometry.faces[i].c]
    const vab = new THREE.Vector3().copy(vb).sub(va)
    const vac = new THREE.Vector3().copy(vc).sub(va)
    // Now we have 2 vectors to get the cross product of...
    const vCross = new THREE.Vector3().copy(vab).cross(vac);
    // Find the largest axis of the plane normal...
    vCross.set(Math.abs(vCross.x), Math.abs(vCross.y), Math.abs(vCross.z))
    const majorAxis = vCross.x > vCross.y ? (vCross.x > vCross.z ? 'x' : vCross.y > vCross.z ? 'y' : vCross.y > vCross.z) : vCross.y > vCross.z ? 'y' : 'z'
    // Take the other two axis from the largest axis
    const uAxis = majorAxis == 'x' ? 'y' : majorAxis == 'y' ? 'x' : 'x';
    const vAxis = majorAxis == 'x' ? 'z' : majorAxis == 'y' ? 'z' : 'y';
    geometry.faceVertexUvs[0][i] = [
      new THREE.Vector2(va[uAxis], va[vAxis]),
      new THREE.Vector2(vb[uAxis], vb[vAxis]),
      new THREE.Vector2(vc[uAxis], vc[vAxis]),
    ]
  }
  geometry.elementsNeedUpdate = geometry.verticesNeedUpdate = true;
}

export const planeUnwrapUVs = (geometry: any) => {
  geometry.computeBoundingBox();
  const max = geometry.boundingBox.max,
    min = geometry.boundingBox.min;
  const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
  const faces = geometry.faces;
  geometry.faceVertexUvs[0] = [];

  for (let i = 0; i < faces.length; i++) {
    const v1 = geometry.vertices[faces[i].a],
      v2 = geometry.vertices[faces[i].b],
      v3 = geometry.vertices[faces[i].c];
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
      new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
      new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
    ]);
  }
  geometry.uvsNeedUpdate = true;
}
