import * as BABYLON from '@babylonjs/core';

class Cell {
    constructor(mesh) {
        this.mesh = mesh;
        this.isSelected = false;
        this._diffuseColor = new BABYLON.Color4(0, 0, 0);
        this._ambientColor = new BABYLON.Color4(0, 0, 0);
        this._emissiveColor = new BABYLON.Color4(0, 0, 0);
        this.type = null;
    }

    get diffuseColor() {
        return this.mesh.material.diffuseColor;
    }

    set diffuseColor(color) {
        this._diffuseColor = color;
        this.mesh.material.diffuseColor = color;
    }
    get emissiveColor() {
        return this.mesh.material.emissiveColor;
    }

    set emissiveColor(color) {
        this._emissiveColor = color;
        this.mesh.material.emissiveColor = color;
    }

    get ambientColor() {
        return this.mesh.material.ambientColor;
    }

    set ambientColor(color) {
        this._ambientColor = color;
        this.mesh.material.ambientColor = color;
    }

    get material() {
        return this.mesh.material;
    }

    set material(material) {
        this.mesh.material = material;
    }

    get position() {
        return this.mesh.position;
    }

    get isPickable() {
        return this.mesh.isPickable;
    }

    set isPickable(pickable) {
        this.mesh.isPickable = pickable;
    }

    dispose() {
        if (this.mesh !== null) {
            this.mesh.material.dispose();
            this.mesh.dispose();
            this.mesh = null;
        }
    }

    // set position(pos) {
    //     this.position = pos;
    // }

    // get position() {
    //     return this.position;
    // }
}

export default Cell;
