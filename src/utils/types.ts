import * as THREE from 'three'

export class Terrain {
    public id: string
    public type: string

    constructor(id: string, type: string) {
        this.id = id
        this.type = type
    }
}

export class Terrains extends Array<Terrain> { }

export class DynamicInstMesh extends THREE.InstancedMesh {
    public additionalIndex: number = 0
    public physicsIndex: number = 0
}
