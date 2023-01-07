import * as THREE from 'three'

export const fogHex = 0x001f3f
export const lightAHex = 0xffffff
export const lightBHex = 0x002288
export const lightCHex = 0x222222

export const backColor = new THREE.Color(0x666666)

export const normalVecX = new THREE.Vector3(1, 0, 0)
export const normalVecY = new THREE.Vector3(0, 1, 0)
export const normalVecZ = new THREE.Vector3(0, 0, 1)
export const startPos = new THREE.Vector3(-3, 0, 0)
export const cameraPos = new THREE.Vector3(0, 15, 15)
export const zeroVec = new THREE.Vector3()
export const zeroVec2 = new THREE.Vector2()

export const tempMultiMatrix1 = new THREE.Matrix4()
export const tempMatrix1 = new THREE.Matrix4()
export const tempMatrix2 = new THREE.Matrix4()

export const gravity = 2
export const fogDensity = 0.002

export const frameRate = 60
export const friction = 50
export const linearDamping = .8
export const rotationDamping = .8

export const scalingFactor = 20

export const terrainWidthExtents = 100
export const terrainDepthExtents = 100
export const terrainWidth = 128
export const terrainDepth = 128
export const terrainMaxHeight = 0
export const terrainMinHeight = 0

export const textureLoader = new THREE.TextureLoader()

export const textureUrls: any = {
    walnut: 'textures/walnut.jpg',
    cherry: 'textures/cherry.jpg',
    yellow: 'textures/yellow.jpg',
}
