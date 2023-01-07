import { nanoid } from 'nanoid'
import { Terrain, Terrains } from '../utils/types'

export interface DescInterface {
  addTerrain(type: string): void
  getTerrains(): Terrains
}

export class DescWorld implements DescInterface {
  private terrains: Terrains = new Terrains()

  addTerrain(type: string) {
    const terrain = new Terrain(this.newID(), type)
    this.terrains.push(terrain)
  }

  getTerrains(): Terrains {
    return this.terrains
  }

  private newID(): string {
    return nanoid(8)
  }
}
