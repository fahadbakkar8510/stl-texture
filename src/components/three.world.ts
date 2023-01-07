import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { backColor, fogHex, fogDensity, lightAHex, lightBHex, lightCHex, acidHexStr, tempMatrix1, residueInstCnt, socketInstCnt, tempColor1, bondSocketHex, socketHex, ballHex, ballInstCnt, startPos, tempMultiMatrix1, tempMatrix2, normalVecZ, cameraPos, zeroVec, terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight, terrainWidthExtents, terrainDepthExtents, textureLoader } from '../utils/constants';
import type { PhysicsInterface } from './physics.world'
import { DragControls } from './drag.controls'
import type { DynamicInstMesh } from '../utils/types'
import { generateHeight } from '../utils/custom'

export interface ThreeInterface {
  animate(): void
  addStlMesh(path: string, id: string, type: string): void
  updateStartPos(): void
  updateDragControls(): void
}

export class ThreeWorld implements ThreeInterface {
  private physicsWorld: PhysicsInterface
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private orbitControls: OrbitControls
  private dragControls: DragControls | undefined
  private stlLoadingManager: THREE.LoadingManager
  private stlLoader: STLLoader
  private stlInstMeshes: Map<string, DynamicInstMesh> = new Map<string, DynamicInstMesh>()
  private startPos: THREE.Vector3 = startPos.clone()

  constructor(canvas: any, physicsWorld: PhysicsInterface) {
    this.physicsWorld = physicsWorld

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = backColor
    this.scene.fog = new THREE.FogExp2(fogHex, fogDensity)

    // Lights
    const lightA = new THREE.DirectionalLight(lightAHex)
    lightA.position.set(1, 1, 1)
    this.scene.add(lightA)

    const lightB = new THREE.DirectionalLight(lightBHex)
    lightB.position.set(-1, -1, -1)
    this.scene.add(lightB)

    const lightC = new THREE.AmbientLight(lightCHex)
    this.scene.add(lightC)

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.copy(cameraPos)
    this.camera.lookAt(zeroVec)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = false
    this.renderer.outputEncoding = THREE.sRGBEncoding
    canvas.value.appendChild(this.renderer.domElement)

    // Orbit Controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)

    // Drag Controls
    this.dragControls = new DragControls(
      this.camera,
      this.renderer.domElement,
      this.physicsWorld,
      this.orbitControls
    )

    // Add ground terrain
    const heightData = generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);
    const terrainGeometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1);
    terrainGeometry.rotateX(- Math.PI / 2);
    const terrainVertices = terrainGeometry.attributes.position.array;
    // // For terrain
    // for (let i = 0, j = 0, l = terrainVertices.length; i < l; i++, j += 3) {
    //   // j + 1 because it is the y component that we modify
    //   terrainVertices[j + 1] = heightData[i];
    // }
    terrainGeometry.computeVertexNormals();
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xC7C7C7 });
    const terrainMesh = new THREE.Mesh(terrainGeometry, groundMaterial);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    this.scene.add(terrainMesh);
    textureLoader.load('grid.png', function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(terrainWidth - 1, terrainDepth - 1);
      groundMaterial.map = texture;
      groundMaterial.needsUpdate = true;
    });
    this.physicsWorld.addMesh('terrain', terrainMesh, 0)

    // Animate
    this.animate()

    // Stl loader
    this.stlLoadingManager = new THREE.LoadingManager(
      () => { console.log('onLoad') },
      (url: string, loaded: number, total: number) => { console.log('onProgress: ', 'url => ', url, 'loaded => ', loaded, 'total => ', total) },
      (url: string) => { console.log('onError: ', url) },
    )
    this.stlLoader = new STLLoader(this.stlLoadingManager)
  }

  async addStlMesh(path: string, id: string, type: string): Promise<void> {
    const stlGeo = await this.stlLoader.loadAsync(path)
    console.log('stlGeo: ', stlGeo)
    let stlMesh: DynamicInstMesh | undefined = this.stlInstMeshes.get(type)
    let index = 0

    // if (stlMesh) {
    //   index = ++stlMesh.additionalIndex
    //   this.instIndexes.set(id, index)
    // } else {
    //   stlMesh = new DynamicInstMesh(
    //     new THREE.SphereGeometry(info.radius),
    //     new THREE.MeshStandardMaterial({ map: getTextTexture(info.name, acidHexStr) }),
    //     residueInstCnt
    //   )
    //   stlMesh.name = info.name
    //   this.scene.add(stlMesh)
    //   this.stlInstMeshes.set(info.name, stlMesh)
    //   this.instIndexes.set(info.id, 0)
    // }
  }

  animate() {
    requestAnimationFrame((t) => {
      this.animate()
      this.renderer.render(this.scene, this.camera)
    })
  }

  updateStartPos() {
    this.startPos.set(startPos.x, startPos.y, this.startPos.z + 0.4)
  }

  updateDragControls() {
    const arrResidueInstMesh: Array<DynamicInstMesh> = []
    this.stlInstMeshes.forEach(instMesh => {
      arrResidueInstMesh.push(instMesh)
    })
    this.dragControls?.setObjects(arrResidueInstMesh)
  }
}
