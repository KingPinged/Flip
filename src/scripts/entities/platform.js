//TODO: add this for platform entity

import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'

export default class Platform {
    /** give the Platform xyz coords */
    constructor(scene, material, config) {
        this.platform = scene.third.physics.add.box(
            config,
            material
        )

    }

    getPlatform() {
        return this.platform
    }
}
