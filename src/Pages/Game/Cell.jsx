class Cell {
    constructor(mesh) {
        this.mesh = mesh;
        this.isSelected = false;
        this._diffuseColor = null;
        this._ambientColor = null;
        this._emissiveColor = null;
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
}

export default Cell;
