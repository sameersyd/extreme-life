import React from "react";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import * as BABYLON from '@babylonjs/core';
// import { GUI } from '@babylonjs/core';
import Axios from 'axios';
import * as GUI from '@babylonjs/gui';
import { GridMaterial } from "@babylonjs/materials/grid";
import Cell from './Cell.jsx';
let pendingSubmit = false;
let offset = 0;

const API_URL = "https://www.comp680elgame.tk/";

// var cellsInput = [];

// const user_id = 63630;
// const user_id = 3902;
// const game_id = 65045;

// const UPDATE_DELAY_MS = 1000;

var gm;
// var gui;

/*
    End game? How to end a game?

    Cell type selection? Implement selector tool.

    When to retreive the next state? How?

    Add delay after request a put operation to slow down api requests.
*/


const onSceneReady = (scene) => {
    getUserID();
    let game_id = gm.game_id;
    gm.canvas = scene.getEngine().getRenderingCanvas();
    gm.scene = scene;
    gm.gui = new UIManager();
    // scene.ambientColor = new BABYLON.Color3(1,1,1);
    // let gridWidth = gm.configurations['gridWidth'];
    setCamera();

    gm.lights["global"] = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    gm.lights["global"].intensity = 0.5;
    
    gm.configurations["cellWidth"] = 0.75;
    gm.configurations["glowLayer"] = new BABYLON.GlowLayer("global-glow", scene);

    //When click event is raised
    let header = createPickedCellDisplay();
    onPointerPick(scene, header);
    
    setupActionMenu(gm);

    gm.getGameConfig(game_id);
    gm.resetState();
    gm.getState(game_id);
};


const setupActionMenu = (gm) => {
    // setting up action menu
    let actionMenuTopAnchor = 39;
    let actionMenuDeltaY = 5;
    let actionMenuLeftAnchor = -39;
    let actionMenuButtonSize = actionMenuDeltaY - 0.5;
    let setButtons = [
        setBoosterButton,
        setSubmitButton,
        setAttackButton,
        setDefendButton,
        // setReplicateButton, 
        // setInfectButton, 
        setWinnerTextButton
    ];
    setButtons.forEach(setButton => {
        setButton(gm.gui, actionMenuTopAnchor, actionMenuLeftAnchor, actionMenuButtonSize);
        actionMenuTopAnchor -= actionMenuDeltaY;
        // gm.cellTypeSelected
    })
}


const createGrid = () => {
    let gridWidth = gm.configurations.gridWidth;
    gm.ground = new BABYLON.MeshBuilder.CreateGround("ground", { width: gridWidth, height: gridWidth }, gm.scene);
    gm.ground.material = new GridMaterial("ground", gm.scene);
    gm.ground.material.gridOffset.x = (gridWidth % 2) ? 0.5 : 0;
    gm.ground.material.gridOffset.z = (gridWidth % 2) ? 0.5 : 0;
    gm.ground.material.majorUnitFrequency = 0;
    gm.ground.isPickable = false;
}

const getUserID = () => {
    let username_game_id = window.location.href.split('/').splice(4);
    gm.user_id = username_game_id[0];
    gm.game_id = username_game_id[1];
}


const getUserNames = (p1_user_id, p2_user_id) => {
    Axios.get(API_URL + "profile/").then(res => {
        console.log(`get returned: ${res}`);
        console.log(`get returned: ${res.status}`);
        let p1, p2;
        res.data.forEach(profile => {
            if (profile.user_id === p1_user_id) p1 = profile.username;
            if (profile.user_id === p2_user_id) p2 = profile.username; 
        })
        // if (profile.user_id === gm.)
    })}


const setCamera = () => {
    gm.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), gm.scene);
    gm.camera.setTarget(BABYLON.Vector3.Zero());
    gm.camera.attachControl(gm.canvas, true);
}


const setWinnerTextButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("gameover", "Player X Wins!");
    button.width = "40%"
    button.height = "40%";
    button.color = "white";
    button.left = "0%";
    button.top = "0%";
    button.cornerRadius = 10;
    button.background = "green";
    button.isVisible = false;
    button.onPointerUpObservable.add(function () {
        button.isEnabled = false;
        button.background = 'gray';
        // button.textBlock.text = "shit!!";
        setWinnerText();
    });
    gui.addButton(button);
}


const setWinnerText = () => {
    gm.gui.setButtonText("gameover", "The other guy won! HA!");
}


const setSubmitButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("submit", "Submit");
    button.textBlock.fontSize = "25%";
    button.width = "20%"
    button.height = "20%";
    button.color = "white";
    button.left = "39%";
    button.top = "39%";
    button.cornerRadius = 10;
    button.background = "green";

    button.onPointerUpObservable.add(function () {
        if (!pendingSubmit) {
            pendingSubmit = true;
            button.isEnabled = false;
            button.background = 'gray';
            gm.sendState(gm.user_id, gm.game_id);
            gm.turnsLeft = 0;
            // gm.gui.getButton("gameover").button.isVisible = true;

        }
    });
    gui.addButton(button);
}

const setBoosterButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("booster", "Activate Booster");
    button.textBlock.fontSize = "25%";
    button.width = "20%"
    button.height = "20%";
    button.color = "white";
    button.left = "39%";
    button.top = "-39%";
    button.cornerRadius = 10;
    button.background = "orange";
    button.onPointerUpObservable.add(function () {
        gm.turnsLeft += gm.boosters.turnbooster;
        button.isEnabled = false;
        button.background = 'gray';
    });
    gui.addButton(button);
}

class Boosters {
    constructor() {
        this.getTurnBooster();
    }

    async getTurnBooster() {
        // get turn booster value from backend.
        // not yet implemented. obviously.
        this.turnbooster = 3;
    }
}

const resetButtonGroup = (gui, groupname) => {
    for (const [key, value] of Object.entries(gui.buttons)) {
        if (value.group === groupname) {
            value.button.isEnabled = true;
            value.button.background = "orange";
        }
    }
}

const setAttackButton = (gui, ypos, xpos, height) => {
    let buttonname = "Attack";
    let button = GUI.Button.CreateSimpleButton(buttonname.toLowerCase(), buttonname);
    button.textBlock.fontSize = "50%";
    button.width = "20%"
    button.height = `${height}%`;
    button.color = "white";
    // button.left = "-39%";
    button.left = `${xpos}%`;
    // button.top = "-39%";
    button.top = `${ypos}%`;
    button.cornerRadius = 10;
    button.background = "orange";
    if (gm.cellTypeSelected === buttonname.toUpperCase()) {
        button.isEnabled = false;
        button.background = 'gray';
    }
    button.onPointerUpObservable.add(function () {
        resetButtonGroup(gui, 'cell-types');
        button.isEnabled = false;
        button.background = 'gray';
        gm.cellTypeSelected = buttonname.toUpperCase();
    });
    gui.addButton(button, "cell-types");
    return button;
}


const setDefendButton = (gui, ypos, xpos, height) => {
    let buttonname = "Defend";
    let button = GUI.Button.CreateSimpleButton(buttonname.toLowerCase(), buttonname);
    button.textBlock.fontSize = "50%";
    button.width = "20%"
    button.height = `${height}%`;
    button.color = "white";
    button.left = `${xpos}%`;
    button.top = `${ypos}%`;
    button.cornerRadius = 10;
    button.background = "orange";
    if (gm.cellTypeSelected === buttonname.toUpperCase()) {
        button.isEnabled = false;
        button.background = 'gray';
    }
    button.onPointerUpObservable.add(function () {
        resetButtonGroup(gui, 'cell-types');
        button.isEnabled = false;
        button.background = 'gray';
        gm.cellTypeSelected = buttonname.toUpperCase();
    });
    gui.addButton(button, "cell-types");
    return button;
}


const setReplicateButton = (gui, ypos, xpos, height) => {
    let buttonname = "Replicate";
    let button = GUI.Button.CreateSimpleButton(buttonname.toLowerCase(), buttonname);
    button.textBlock.fontSize = "50%";
    button.width = "20%"
    button.height = `${height}%`;
    button.color = "white";
    button.left = `${xpos}%`;
    button.top = `${ypos}%`;
    button.cornerRadius = 10;
    button.background = "orange";
    if (gm.cellTypeSelected === buttonname.toUpperCase()) {
        button.isEnabled = false;
        button.background = 'gray';
    }
    button.onPointerUpObservable.add(function () {
        resetButtonGroup(gui, 'cell-types');
        button.isEnabled = false;
        button.background = 'gray';
        gm.cellTypeSelected = buttonname.toUpperCase();
    });
    gui.addButton(button, "cell-types");
    return button;
}


const setInfectButton = (gui, ypos, xpos, height) => {
    let buttonname = "Infect";
    let button = GUI.Button.CreateSimpleButton(buttonname.toLowerCase(), buttonname);
    button.textBlock.fontSize = "50%";
    button.width = "20%";
    button.height = `${height}%`;
    button.color = "white";
    button.left = `${xpos}%`;
    button.top = `${ypos}%`;
    button.cornerRadius = 10;
    button.background = "orange";
    if (gm.cellTypeSelected === buttonname.toUpperCase()) {
        button.isEnabled = false;
        button.background = 'gray';
    }
    button.onPointerUpObservable.add(function () {
        resetButtonGroup(gui, 'cell-types');
        button.isEnabled = false;
        button.background = 'gray';
        gm.cellTypeSelected = buttonname.toUpperCase();
    });
    gui.addButton(button, "cell-types");
    return button;
}


const createPickedCellDisplay = () => {
    // add buttons
    let buttonbox = document.createElement('div');
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

    let tTag = document.createElement('div');
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

    let header = document.createElement('div');
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
                updatePickedCell(pickResult.pickedMesh.name);
                break;
            default:
                console.log("End of switch.");
        }
    }
}


const updatePickedCell = cellID => {
    let pos = cellID.split(' ')[1].split('-');
    let pickedCell = gm.cells[pos[0]][pos[1]];
    if (!pickedCell.isSelected) {
        if (gm.turnsLeft > 0) {
            pickedCell.material.emissiveColor = new BABYLON.Color4(0.2, 0.2, 0.5);
            pickedCell.isSelected = true;
            pickedCell.updateType = gm.cellTypeSelected;
            pickedCell.update_team_number = gm.team_number;
            gm.turnsLeft--;
        }
    }
    else {
        pickedCell.material.emissiveColor = new BABYLON.Color4(0, 0, 0);
        pickedCell.isSelected = false;
        pickedCell.updateType = undefined;
        pickedCell.update_team_number = undefined;
        gm.turnsLeft++;
    }
}


const onRender = () => {
    if (gm.cells !== null && gm.cells !== undefined) {

        gm.setState();
        gm.simglow();
    }
    let subbutton = gm.gui.getButton('submit').button;
    if (pendingSubmit && subbutton.isEnabled) {
        subbutton.isEnabled = false;
    }
    else if (!subbutton.isEnabled && !pendingSubmit) {
        // subbutton.isEnabled = true;
    }

};


async function getNextState(game_id, current_step_id) {
    // put-get requests
    // only get when new step id is equal to the new one.
    let step_id = await gm.putState(game_id);
    if (step_id !== current_step_id) {
        await gm.getState(game_id);
    }
    return step_id;
}


class GameManager {
    constructor() {
        this.scene = null;
        this.gui = null;
        this.canvas = null;
        this.cells = undefined;
        this.cellsInput = null;
        this.lights = {};
        this.configurations = {};
        this.turnsLeft = 6;
        this.cellTypeSelected = "ATTACK";
        this.boosters = new Boosters();
        this.is_game_over = false;
        this.team_number = null;
    }

    simglow() {
        this.configurations["glowLayer"].intensity += Math.random() * 0.05 * (Math.round(Math.random()) ? 1 : -1); 
    }

    resetState = () => {
        var gridWidth = this.configurations['gridWidth'];
        var cellWidth = this.configurations['cellWidth'];
        // first cell position in rows position plus half unit size.
        offset = -(gridWidth - Math.ceil(cellWidth)) / 2;
        this.cells = [];
        for (let x = 0; x < gridWidth; x++) {
            this.cells.push([]);
            for (let z = 0; z < gridWidth; z++) {
                this.cells[x].push(new Cell(new BABYLON.MeshBuilder.CreateBox(`cell ${x}-${z}`, { size: cellWidth }, this.scene)));
                this.cells[x][z].material = new BABYLON.StandardMaterial('default', this.scene);
                this.cells[x][z].material.specularColor = new BABYLON.Color4(1,1,1);
                this.cells[x][z].position.z = offset + z;
                this.cells[x][z].position.x = offset + x;
                this.cells[x][z].position.y = cellWidth / 2;
                this.cells[x][z].isPickable = true;
                this.cells[x][z].team_number = 0;
            }
        }

        this.cells.forEach(cells => cells.forEach(cell => console.log(`cell x: ${cell.position.x} y: ${cell.position.y}`)));
    }

    setState = () => {
        if (this.cellsInput !== null && this.cells !== undefined) {
            this.resetState();
            this.cells.forEach(cell => console.log(`cell: ${cell}`));
            this.cellsInput.forEach(cell => {
                let currCell = this.cells[cell["x_loc"]][cell["y_loc"]];
                currCell.diffuseColor = (cell['team_number'] === 1) ? new BABYLON.Color4(0, 1, 0) : new BABYLON.Color4(1, 0, 0);
                currCell.team_number = cell['team_number'];
                currCell.type = cell['cell_type'];
                currCell.life = cell['life'];
                currCell.resilience = cell['resilience'];
                // console.log(`${currCell.position.x}, ${currCell.position.y}, ${currCell.team_number}, ${currCell.type}`);
            })
            this.cellsInput = null;
        }

    }

    setNewState = (cellsInput) => {
        this.cellsInput = cellsInput;
    }


    updateState = () => {
        // remove resetState from within getState and replace.
        this.resetState();
        this.getState(this.game_id);
    }


    async sendState(user_id, game_id) {
        // serialize data.
        let cell_placements = [];
        console.log(this.cells);
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                let type = cell.updateType ? cell.updateType : cell.type;
                let team_number = cell.update_team_number ? cell.update_team_number : cell.team_number;
                console.log(`${cell.position.x}, ${cell.position.y}`);
                console.log(type);
                console.log(`cell.team_number: ${cell.team_number}`);
                console.log(`this.team_number: ${this.team_number}`);
                if (type !== null && type !== undefined && team_number === this.team_number) {
                    let team_number = cell.update_team_number ? cell.update_team_number : cell.team_number;
                    cell_placements.push({
                        'cell_type': type,
                        'team_number': team_number,
                        'x_loc': cell.position.x - offset,
                        'y_loc': cell.position.z - offset
                    });
                }
            })
        })

        let data = {
            'user_id': user_id,
            'cell_placements': cell_placements
        }

        console.log(`data: ${data}`);
        // api call with data
        await this.patchState(game_id, data);
    }

    

    async patchState(game_id, data) {
        // Send patch request to backend.
        Axios.patch(API_URL + "game/" + game_id, data).then(res => {
            this.getState(game_id);
            // pendingSubmit = false;
            // this.gui.getButton('submit').button.background = "green";

        }).catch(err => {
            console.error(err);
            // pendingSubmit = false;
            // this.gui.getButton('submit').button.background = "green";
        })
    }

    async putState(game_id) {
        Axios.put(API_URL + "game/" + game_id).then(res => {
            return res.data;

        }).catch(err => {
            console.error(`put err: ${err}`);
            return null;
        })
    }

    async getState(game_id) {
        // Send get request to backend.
        Axios.get(API_URL + "game/" + game_id).then(res => {
            this.resetState();
            this.getDataFromResponse(res);
            this.setNewState(res.data.current_state.player_occupied_cells);
        })
    }

    async getGameConfig(game_id) {
        await Axios.get(API_URL + "game/" + game_id).then(res => {
            this.configurations["gridWidth"] = res.data.grid_length;
            this.configurations["maxTurns"] = res.data.max_turns;
            createGrid();
        })
    }

    getDataFromResponse = (res) => {
        this.current_turn = res.data.current_state.current_turn;
        this.score_card = res.data.score_card;
        console.log(`this.team_number: ${this.team_number}`);
        if (this.team_number === null) {
            this.team_number = (res.data.p1_user_id === gm.user_id) ? 1 : -1;
            gm.camera.position = new BABYLON.Vector3(0, 5, -10 * this.team_number);
            gm.camera.setTarget(BABYLON.Vector3.Zero());

        }
        console.log(`awaiting_p1: ${res.data.awaiting_p1}`);
        console.log(`awaiting_p2: ${res.data.awaiting_p2}`);
        this.gui.buttons.submit.button.isEnabled = this.team_number === 1 ? res.data.awaiting_p1 : res.data.awaiting_p2;
        
        if (res.data.is_game_over) {
            this.is_game_over = true;
            // this.gui.getButton("gameover").button.isVisible = false;
        }
    }


    getDeltaTime() {
        return this.scene.getEngine().getDeltaTime();
    }

    setGridWidth = (width) => {
        this.configurations['gridWidth'] = width;
    }
}

class UIManager {
    constructor() {
        this.gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("manager");
        this.gui.isForeground = true;
        this.buttons = {};
    }

    addButton = (btn, group) => {
        this.buttons[btn.name] = {
            'button': btn,
            'group': group
        };
        btn.isPointerBlocker = true;
        this.gui.addControl(this.buttons[btn.name].button);
    }

    getButton = name => {
        return this.buttons[name];
    }

    setButtonText = (name, text) => {
        this.getButton(name).button.textBlock.text = text;
    }
}


gm = new GameManager();  // GameManager




const Game = () => (
    <div>
        <script type="text/javascript"></script>
        <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" style={{ width: '100%', height: '100%' }} />
    </div>
);




export default Game;
