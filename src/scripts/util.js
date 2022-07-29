export async function teleport(object, x, y, z) {
  // set body to be kinematic
  object.body.setCollisionFlags(2)

  // set the new position
  object.position.set(2, x, y, z)
  object.rotation.set(0, 0, 0)

  object.body.needUpdate = true

  // this will run only on the next update if body.needUpdate = true
  return new Promise((resolve, reject) => {
    object.body.once.update(() => {
      // set body back to dynamic
      object.body.setCollisionFlags(0)

      // if you do not reset the velocity and angularVelocity, the object will keep it
      object.body.setVelocity(0, 0, 0)
      object.body.setAngularVelocity(0, 0, 0)
      resolve()
    })
  })
}

export function randomColor() {
  return '#' + (((1 << 24) * Math.random()) | 0).toString(16)
}

export function random(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function rotate(object, x, y, z) {
  //TODO: the rotation rotates around the head not the origin
  // set body to be kinematic
  object.body.setCollisionFlags(2)

  // set the new position
  object.rotation.set(x * (Math.PI / 180), y * (Math.PI / 180), z * (Math.PI / 180))

  object.body.needUpdate = true

  return new Promise((resolve, reject) => {
    object.body.once.update(() => {
      // set body back to dynamic
      object.body.setCollisionFlags(0)

      // if you do not reset the velocity and angularVelocity, the object will keep it
      object.body.setVelocity(0, 0, 0)
      object.body.setAngularVelocity(0, 0, 0)
      resolve()
    })
  })
}
