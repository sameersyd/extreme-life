import React from "react";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import * as BABYLON from '@babylonjs/core';
// import { GUI } from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { GridMaterial } from "@babylonjs/materials/grid";
import Cell from './Cell.jsx';
const GRIDWIDTH = 10; // temporary until figure out how to set gridwidth.
const PLAYER = 1;
const TURNS = 6;
const TURNBOOSTER = 3;

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
    scene.ambientColor = new BABYLON.Color3(1,1,1);
    let gridWidth = gm.configurations['gridWidth'];
    gm.scene = scene;
    gm.canvas = canvas;
    gm.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10 * PLAYER), scene);
    gm.camera.setTarget(BABYLON.Vector3.Zero());
    gm.camera.attachControl(canvas, true);
    gm.lights["global"] = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    gm.lights["global"].intensity = 0.5;
    gm.ground = new BABYLON.MeshBuilder.CreateGround("ground", { width: gridWidth, height: gridWidth}, scene);
    gm.ground.material = new GridMaterial("ground", scene);
    gm.ground.isPickable = false;
    gm.configurations["cellWidth"] = 0.75;
    gm.configurations["glowLayer"] = new BABYLON.GlowLayer("global-glow", scene);
    gm.setupCells();
    //When click event is raised
    onPointerPick(scene, createPickedCellDisplay());
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("test");
    advancedTexture.isForeground = true;
    setBoosterButton(advancedTexture);
};

const setBoosterButton = (gui) => {
    var button1 = GUI.Button.CreateSimpleButton("booster", "Activate Booster");
    button1.width = "20%"
    button1.height = "20%";
    button1.color = "white";
    button1.left = "39%";
    button1.top = "-39%";
    button1.cornerRadius = 10;
    button1.background = "orange";
    button1.onPointerUpObservable.add(function () {
        gm.turnsLeft += TURNBOOSTER;
        button1.isEnabled = false;
        button1.background = 'gray';
    });
    button1.isPickable = true;
    gui.addControl(button1);
}


const createPickedCellDisplay = () => {
    // add buttons
    var buttonbox = document.createElement('div');
    buttonbox.id = "buttonbox";
    buttonbox.style.position = "absolute";
    buttonbox.style.top = "1%";
    buttonbox.style.left = "1%";
    // buttonbox.style.border = "5pt inset blue";
    buttonbox.style.padding = "2pt";
    buttonbox.style.paddingRight = "2pt";
    buttonbox.style.width = "10em";
    buttonbox.style.display = "block";
    document.body.appendChild(buttonbox);

    var tTag = document.createElement('div');
    tTag.id = "choose";
    tTag.textContent = "Last Cell Clicked";
    tTag.style.textAlign = "center";
    // tTag.style.border = "2pt solid gold";
    tTag.style.marginLeft = "1.5pt";
    tTag.style.marginTop = "3pt";
    tTag.style.marginBottom = "2pt";
    tTag.style.backgroundColor = "dodgerblue";
    tTag.style.width = "96%";
    tTag.style.fontSize = "1.0em";
    tTag.style.color = "white";
    // buttonbox.appendChild(tTag);

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
    // buttonbox.appendChild(header);
    return header;
}


const onPointerPick = (scene, header) => {

    scene.onPointerPick = function (evt, pickResult) {
        // We try to pick an object
        console.log(`evt: ${evt}`);
        console.log(`pickedResult: ${pickResult}`);
        if (pickResult.hit) {
            let meshName = pickResult.pickedMesh.name;
            header.textContent = meshName;
            processOnPointPickHit(pickResult);
        }
    };
}


const processOnPointPickHit = pickResult => {
    if (pickResult.pickedMesh) {
        switch (pickResult.pickedMesh.name.substring(0, 4)) {
            case "cell":
                updateSelectedCell(pickResult.pickedMesh.name);
                break;
            default:
                console.log("End of switch.");
        }
    }
}


const updateSelectedCell = cellID => {
    let pos = cellID.split(' ')[1].split('-');
    let pickedCell = gm.cells[pos[0]][pos[1]];
    if (!pickedCell.isSelected) {
        if (gm.turnsLeft > 0) {
            pickedCell.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.5);
            pickedCell.isSelected = true;
            gm.turnsLeft--;
        }
    }
    else {
        pickedCell.material.emissiveColor = new BABYLON.Color4(0, 0, 0);
        pickedCell.isSelected = false;
        gm.turnsLeft++;
    }
}


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
        <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" style={{width: '100%', height: '100%'}}/>
  </div>
);

const sendSelectedCells = () => {
    // serialize data.
    // api call with data
}


class GameManager {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.cells = null;
        this.lights = {};
        // this.materials = {};
        this.configurations = {};
        this.turnsLeft = TURNS;
    }

    setupCells() {
        var gridWidth = gm.configurations['gridWidth'];
        var cellWidth = gm.configurations['cellWidth'];
        // first cell position in rows position plus half unit size.
        var offset = -(gridWidth - Math.ceil(cellWidth)) / 2;
        // does not work since reference to Array object is used to fill rows (i think)
        // var _cells = Array(gridWidth).fill(Array(gridWidth).fill(0));
        this.cells = [];
        for (let x = 0; x < gridWidth; x++) {
            gm.cells.push([]);
            for (let z = 0; z < gridWidth; z++) {
                gm.cells[x].push(new Cell(new BABYLON.MeshBuilder.CreateBox(`cell ${x}-${z}`, { size: cellWidth }, this.scene)));
                gm.cells[x][z].material = new BABYLON.StandardMaterial('default', this.scene);
                gm.cells[x][z].material.specularColor = new BABYLON.Color4(1,1,1);
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
            this.cells[cell["x_loc"]][cell["y_loc"]].diffuseColor = (cell['team_number'] === 1) ? new BABYLON.Color4(0, 1, 0) : new BABYLON.Color4(1, 0, 0);
            // this.cells[cell["x_loc"]][cell["y_loc"]].rotation.y += (rpm / 60) * Math.PI * 2 * (this.getDeltaTime() / 1000);
        })
        this.cells.forEach(cells => cells.forEach(cell => {
            if (cell.isSelected) {
                cell.material.alpha += Math.random();
            }
        }))

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
