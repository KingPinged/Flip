//TODO: add this for platform entity

import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'

export default class Platform {
    /** give the Platform xyz coords */
    constructor(scene, material, config) {
        scene.third.physics.add.box(
            config,
            material
        )

    }
}
