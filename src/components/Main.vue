<template>
  <div ref='canvas'></div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { DescWorld } from './desc.world'
import { ThreeWorld } from './three.world'
import { PhysicsWorld } from './physics.world'

const canvas = ref()

onMounted(() => {
  init()
})

async function init() {
  // Set worlds
  const descWorld = new DescWorld()
  const physicsWorld = new PhysicsWorld()
  await physicsWorld.init()
  const threeWorld = new ThreeWorld(canvas, physicsWorld)

  // Add terrains to description world
  descWorld.addTerrain('walnut')
  // descWorld.addTerrain('cherry')
  // descWorld.addTerrain('yellow')

  // Generate three world
  const modelPath = 'models/example.stl'
  const descTerrains = descWorld.getTerrains()

  for (let i = 0; i < descTerrains.length; i++) {
    await threeWorld.addStlMesh(modelPath, descTerrains[i].id, descTerrains[i].type)
    threeWorld.updateStartPos()
  }

  // threeWorld.updateDragControls()
}
</script>
