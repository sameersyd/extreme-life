import React from "react";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import * as BABYLON from '@babylonjs/core'
const GRIDWIDTH = 10; // temporary until figure out how to set gridwidth.

var cellsInput = {
    "game_data": {
        "grid_length": 2,
        "grid_height": 2,
        "player_cells": [
            {
                "x_loc": 2,
                "y_loc": 2,
                "team_number": -1, //red
                "life": 1
            },
            {
                "x_loc": 0,
                "y_loc": 0,
                "team_number": 1, //green
                "life": 1
            },
            {
                "x_loc": 1,
                "y_loc": 1,
                "team_number": -1, //red
                "life": 1
            },
            {
                "x_loc": 0,
                "y_loc": 1,
                "team_number": 1, //green
                "life": 1
            }
        ]
    }
}


const onSceneReady = (scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    // gm = new GameManager(scene, canvas);
    let gridWidth = gm.configurations['gridWidth'];
    gm.scene = scene;
    gm.canvas = canvas;
    // gm.canvas.size = '8000px';
    gm.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    gm.camera.setTarget(BABYLON.Vector3.Zero());
    gm.camera.attachControl(canvas, true);
    gm.lights["global"] = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    gm.lights["global"].intensity = 0.7;
    gm.materials["red"] = new BABYLON.StandardMaterial("redMat", scene);
    gm.materials["red"].emissiveColor = new BABYLON.Color4(1, 0, 0);
    gm.materials["green"] = new BABYLON.StandardMaterial("grnMat", scene);
    gm.materials["green"].emissiveColor = new BABYLON.Color4(0, 1, 0);
    gm.ground = new BABYLON.MeshBuilder.CreateGround("ground", { width: gridWidth, height: gridWidth}, scene);
    gm.materials['yellow'] = new BABYLON.StandardMaterial("ground", scene);
    gm.ground.isPickable = false;
    gm.materials['yellow'].emissiveColor = new BABYLON.Color4(1, 1, 0);
    gm.materials['yellow'].intensity = 0;
    gm.ground.material = gm.materials['yellow']; 
    gm.configurations["cellWidth"] = 0.75;
    gm.setupCells();


    // add buttons
    var buttonbox = document.createElement('div');
    buttonbox.id = "buttonbox";
    buttonbox.style.position = "absolute";
    buttonbox.style.top = "60px";
    buttonbox.style.left = "33%";
    // buttonbox.style.border = "5pt inset blue";
    buttonbox.style.padding = "2pt";
    buttonbox.style.paddingRight = "2pt";
    buttonbox.style.width = "10em";
    buttonbox.style.display = "block";
    document.body.appendChild(buttonbox);

    var tTag = document.createElement('div');
    tTag.id = "choose";
    tTag.textContent = "Cell Label";
    tTag.style.textAlign = "center";
    // tTag.style.border = "2pt solid gold";
    tTag.style.marginLeft = "1.5pt";
    tTag.style.marginTop = "3pt";
    tTag.style.marginBottom = "2pt";
    tTag.style.backgroundColor = "dodgerblue";
    tTag.style.width = "96%";
    tTag.style.fontSize = "1.0em";
    tTag.style.color = "white";
    buttonbox.appendChild(tTag);


    var header = document.createElement('div');
    header.id = "header";
    header.textContent = "Click Cell";
    header.style.textAlign = "center";
    // header.style.border = "2pt solid red";
    header.style.marginLeft = "1.5pt";
    header.style.backgroundColor = "teal";
    header.style.width = "96%";
    header.style.fontSize = "1.0em";
    header.style.color = "black";
    buttonbox.appendChild(header);

    //When click event is raised
    scene.onPointerDown = function (evt, pickResult) {
        // We try to pick an object
        if (pickResult.hit) {
            header.textContent = pickResult.pickedMesh.name;
        }
    };


    
};


const onRender = () => {
    if (gm.cells !== null) {
        gm.updateCells(cellsInput['game_data']['player_cells']);
    }
};




const Game = () => (
  <div>
        <script type="text/javascript">
            {gm.setGridWidth(GRIDWIDTH)}
        </script>
        <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" height="500vm" width="500vm"/>
  </div>
);


class GameManager {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.cells = null;
        this.lights = {};
        this.materials = {};
        this.configurations = {};
    }

    setupCells() {
        var gridWidth = gm.configurations['gridWidth'];
        var cellWidth = gm.configurations['cellWidth'];
        // first cell position in rows position plus half unit size.
        var offset = -(gridWidth / 2 - cellWidth / 2);
        // does not work since reference to Array object is used to fill rows (i think)
        // var _cells = Array(gridWidth).fill(Array(gridWidth).fill(0));
        this.cells = [];
        for (let x = 0; x < gridWidth; x++) {
            gm.cells.push([]);
            for (let z = 0; z < gridWidth; z++) {
                gm.cells[x].push(new BABYLON.MeshBuilder.CreateBox(`cell ${x}-${z}`, { size: cellWidth }, this.scene));
                gm.cells[x][z].position.z = offset + z;
                gm.cells[x][z].position.x = offset + x;
                gm.cells[x][z].position.y = 0.5;
                gm.cells[x][z].isPickable = true;
            }
        }

        this.cells.forEach(cells => cells.forEach(cell => console.log(`cell x: ${cell.position.x} y: ${cell.position.y}`)));
    }

    updateCells(cellsInput) {
        // const rpm = 10;
        cellsInput.forEach(cell => {
            this.cells[cell["x_loc"]][cell["y_loc"]].material = (cell['team_number'] === 1) ? this.materials["green"] : this.materials["red"];
            // this.cells[cell["x_loc"]][cell["y_loc"]].rotation.y += (rpm / 60) * Math.PI * 2 * (this.getDeltaTime() / 1000);
        })
    }

    getDeltaTime() {
        return this.scene.getEngine().getDeltaTime();
    }

    setGridWidth(width) {
        this.configurations['gridWidth'] = width;
    }

    
}

var gm = new GameManager();  // GameManager
export default Game;


