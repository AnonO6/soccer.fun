import { Geometry } from "three-stdlib"
import type * as THREE from "three"

export function scaleGeometry(geometry: Geometry, scaleX: number, scaleY: number, scaleZ: number) {
  geometry.vertices.forEach((vertex) => {
    vertex.x *= scaleX
    vertex.y *= scaleY
    vertex.z *= scaleZ
  })

  geometry.verticesNeedUpdate = true
}

export function toConvexProps(bufferGeometry: THREE.BufferGeometry, scale = 1) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry)
  scaleGeometry(geo, scale, scale, scale)
  geo.mergeVertices()
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]
}

