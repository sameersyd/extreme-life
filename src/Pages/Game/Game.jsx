import React, { Component } from 'react';
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import * as BABYLON from '@babylonjs/core';
// import { GUI } from '@babylonjs/core';
import Axios from 'axios';
import * as GUI from '@babylonjs/gui';
import { GridMaterial } from "@babylonjs/materials/grid";
import Cell from './Cell.jsx';
import UIManager from "./UIManager.js";

const API_URL = "https://www.comp680elgame.tk/";

var gm;
let pendingSubmit = false;

// Need backend logic before requesting updates, or game ends as soon as it loads.

/*
    End game? How to end a game?

    Cell type selection? Implement selector tool.

    When to retreive the next state? How?

    Add delay after request a put operation to slow down api requests.
*/


const onSceneReady = (scene) => {
    getUserID();
    let game_id = gm.game_id;
    console.log(`opponame: ${gm.opponame}`);
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

    // let topY = '-39%';
    // let leftX = '39%';
    // let butHeight = '5%';
    
    setUpdateButton(gm.gui);
    // setSkybox();

    setupActionMenu(gm);
    gm.getGameConfig(game_id);
    gm.resetState();
    gm.getState(game_id);
    console.log(Date.now());
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
        setWinnerTextButton,
        setExitButton
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


const setCamera = () => {
    gm.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), gm.scene);
    gm.camera.setTarget(BABYLON.Vector3.Zero());
    gm.camera.attachControl(gm.canvas, true);
}


const setWinnerTextButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("gameover", "Game Over!");
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
        setWinnerText();
        gui.getButton('submit').button.isVisible = false;
        gui.getButton('exit').button.isVisible = true;
    });
    gui.addButton(button);
}


const setWinnerText = () => {
    let card = gm.score_card;
    let p1_wins = card.p1_score > card.p2_score;
    let implayer1 = gm.team_number === 1;
    let text = `${p1_wins ? (implayer1 ? gm.currname : gm.opponame) : (implayer1 ? gm.opponame : gm.currname)} wins!`;
    if (implayer1) text += `\nYour score: ${card.p1_score}\n${gm.opponame} score: ${card.p2_score}`;
    else text += `\nYour score: ${card.p2_score}\n${gm.opponame} score: ${card.p1_score}`;
    gm.gui.setButtonText("gameover", `${text}`);
}


const setExitButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("exit", "Exit");
    button.textBlock.fontSize = "25%";
    button.width = "20%"
    button.height = "20%";
    button.color = "white";
    button.left = "39%";
    button.top = "39%";
    button.cornerRadius = 10;
    button.background = "red";
    button.isVisible = false;
    
    button.onPointerUpObservable.add(function () {
        window.location = '/';
    });
    gui.addButton(button);
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


const setUpdateButton = (gui) => {
    let button = GUI.Button.CreateSimpleButton("update", "Update");
    button.textBlock.fontSize = "75%";
    button.width = "20%"
    button.height = "5%";
    button.color = "white";
    button.left = "-39%";
    button.top = "-39%";
    button.cornerRadius = 10;
    button.background = "green";
    button.onPointerUpObservable.add(function () {
        getNextState(gm.game_id);
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
        // console.log(`evt: ${evt}`);
        // console.log(`pickedResult: ${pickResult}`);
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
            pickedCell.material.emissiveColor.set(0.2, 0.2, 0.5);
            pickedCell.isSelected = true;
            pickedCell.updateType = gm.cellTypeSelected;
            pickedCell.update_team_number = gm.team_number;
            gm.turnsLeft--;
        }
    }
    else {
        pickedCell.material.emissiveColor.set(0, 0, 0);
        // pickedCell.material.emissiveColor = new BABYLON.Color4(0, 0, 0);
        pickedCell.isSelected = false;
        pickedCell.updateType = undefined;
        pickedCell.update_team_number = undefined;
        gm.turnsLeft++;
    }
}


const onRender = () => {
    if (gm.cells !== null && gm.cells !== undefined) {
        // if (!gm.is_game_over && !gm.waitingOnUpdateResponse && gm.isTimeForUpdate(3000)) {
        //     getNextState(gm.game_id);
        //     gm.setLastTimeUpdated();
        // }
        gm.setState();
        // gm.simglow();
    }
    let subbutton = gm.gui.getButton('submit').button;
    if (pendingSubmit && subbutton.isEnabled) {
        subbutton.isEnabled = false;
    }
    else if (!subbutton.isEnabled && !pendingSubmit) {
        // subbutton.isEnabled = true;
    }

};


async function getNextState(game_id) {
    // put-get requests
    const put = async function() {
        gm.waitingOnUpdateResponse = true;
        gm.putState(game_id);
    };
    put().then(() => gm.waitingOnUpdateResponse = false)
        .catch(() => gm.waitingOnUpdateResponse = false);
}


class GameManager {
    constructor() {
        this.scene = null;
        this.gui = null;
        this.canvas = null;
        this.ground = null;
        this.skybox = null;
        this.cells = undefined;
        this.cellsInput = null;
        this.lights = {};
        this.configurations = {};
        this.turnsLeft = 6;
        this.cellTypeSelected = "ATTACK";
        this.boosters = new Boosters();
        this.is_game_over = false;
        this.team_number = null;
        this.lastUpdateTime = Date.now();
        this.waitingOnUpdateResponse = false;
    }

    isTimeForUpdate = (deltaMiSec) => {
        return deltaMiSec <= (Date.now() - this.lastUpdateTime);
    }

    setLastTimeUpdated = () => {
        this.lastUpdateTime = Date.now();
        return this.lastUpdateTime;
    } 

    simglow() {
        this.configurations["glowLayer"].intensity += Math.random() * 0.05 * (Math.round(Math.random()) ? 1 : -1); 
    }

    resetState = () => {
        var gridWidth = this.configurations['gridWidth'];
        var cellWidth = this.configurations['cellWidth'];
        // first cell position in rows position plus half unit size.
        if (this.cells !== undefined) this.cells.forEach(cells => {
            cells.forEach(cell => {
                cell.dispose();
                cell = null;
            });
            cells = null;
        });
        this.cells = [];
        for (let x = 0; x < gridWidth; x++) {
            this.cells.push([]);
            for (let z = 0; z < gridWidth; z++) {
                this.cells[x].push(new Cell(new BABYLON.MeshBuilder.CreateBox(`cell ${x}-${z}`, { size: cellWidth }, this.scene)));
                this.cells[x][z].material = new BABYLON.StandardMaterial('default', this.scene);
                this.cells[x][z].position.z = gm.configurations.offset + z;
                this.cells[x][z].position.x = gm.configurations.offset + x;
                this.cells[x][z].position.y = cellWidth / 2;
                this.cells[x][z].isPickable = true;
                this.cells[x][z].team_number = 0;
            }
        }
    }

    setState = () => {
        if (this.cellsInput !== null && this.cells !== undefined) {
            this.resetState();
            this.cellsInput.forEach(cell => {
                let currCell = this.cells[cell["x_loc"]][cell["y_loc"]];
                if (cell['team_number'] === 1) currCell.diffuseColor.set(0, 1, 0); // set to player 1 to green.
                else currCell.diffuseColor.set(1, 0, 0); // set player 2 to red.
                currCell.team_number = cell['team_number'];
                currCell.type = cell['cell_type'];
                currCell.life = cell['life'];
                currCell.resilience = cell['resilience'];
            })
            this.cellsInput = null;
        }

    }

    setNewState = (cellsInput) => {
        this.cellsInput = cellsInput;
    }


    updateState = () => {
        // remove resetState from within getState and replace.
        // this.resetState();
        this.getState(this.game_id);
    }


    async sendState(user_id, game_id) {
        // serialize data.
        let cell_placements = [];
        // console.log(this.cells);
        this.cells.forEach(cells => {
            cells.forEach(cell => {
                let type = cell.updateType ? cell.updateType : cell.type;
                let team_number = cell.update_team_number ? cell.update_team_number : cell.team_number;
                // console.log(`${cell.position.x}, ${cell.position.y}`);
                // console.log(type);
                // console.log(`cell.team_number: ${cell.team_number}`);
                // console.log(`this.team_number: ${this.team_number}`);
                if (type !== null && type !== undefined && team_number === this.team_number) {
                    let team_number = cell.update_team_number ? cell.update_team_number : cell.team_number;
                    cell_placements.push({
                        'cell_type': type,
                        'team_number': team_number,
                        'x_loc': cell.position.x - gm.configurations.offset,
                        'y_loc': cell.position.z - gm.configurations.offset
                    });
                }
            })
        })

        let data = {
            'user_id': user_id,
            'cell_placements': cell_placements
        }

        // console.log(`data: ${data}`);
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
        // console.log(`team_number: ${this.team_number}`)
        if (this.team_number !== 1) {
            this.getState(this.game_id);
            return
        }
        
        Axios.put(API_URL + "game/" + game_id).then(res => {
            // this.resetState();
            this.getDataFromResponse(res);
            this.setNewState(res.data.current_state.player_occupied_cells);        }).catch(err => {
            console.error(`put err: ${err}`);
        })
    }

    async getState(game_id) {
        // Send get request to backend.
        Axios.get(API_URL + "game/" + game_id).then(res => {
            // this.resetState();
            this.getDataFromResponse(res);
            this.setNewState(res.data.current_state.player_occupied_cells);
        })
    }

    async getGameConfig(game_id) {
        await Axios.get(API_URL + "game/" + game_id).then(res => {
            this.configurations["gridWidth"] = res.data.grid_length;
            this.configurations["maxTurns"] = res.data.max_turns;
            this.configurations["offset"] = -(this.configurations["gridWidth"] - Math.ceil(this.configurations["cellWidth"])) / 2;

            createGrid();
        })
    }

    getDataFromResponse = (res) => {
        this.current_turn = res.data.current_state.current_turn;
        this.score_card = res.data.score_card;
        // console.log(`this.team_number: ${this.team_number}`);
        if (this.team_number === null) {
            // console.log(`res.data.p1_user_id: ${res.data.p1_user_id}, gm.user_id: ${gm.user_id}`);
            // console.log(`res.data.p1_user_id === gm.user_id ${res.data.p1_user_id === parseInt(gm.user_id)}`);
            this.team_number = (res.data.p1_user_id === parseInt(gm.user_id)) ? 1 : -1;
            gm.camera.position = new BABYLON.Vector3(0, 5, -10 * this.team_number);
            gm.camera.setTarget(BABYLON.Vector3.Zero());

        }
        // console.log(`awaiting_p1: ${res.data.awaiting_p1}`);
        // console.log(`awaiting_p2: ${res.data.awaiting_p2}`);
        this.gui.buttons.submit.button.isEnabled = this.team_number === 1 ? res.data.awaiting_p1 : res.data.awaiting_p2;
        
        if (res.data.is_game_over) {
            this.is_game_over = true;
            this.gui.getButton("gameover").button.isVisible = true;
        }
    }


    getDeltaTime() {
        return this.scene.getEngine().getDeltaTime();
    }

    setGridWidth = (width) => {
        this.configurations['gridWidth'] = width;
    }
}


const setSkybox = () => {
    gm.skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 1000.0 }, gm.scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skybox", gm.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", gm.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    gm.skybox.material = skyboxMaterial;
}

gm = new GameManager();  // GameManager


class Game extends Component {
    // constructor(props) {
    //     super(props)
    //     console.log(`props.currUsername: ${props.currUsername}`)
    //     this.state = {
    //         currUsername: props.currUsername,
    //         otherUsername: props.otherUsername
    //     }
    //     console.log(`this.state.currUsername: ` + this.state.currUsername);
    //     console.log(`this.state.otherUsername: ${this.state.otherUsername}`)
    // }

    render() { 
        if (!this.props.currUser) return null
        if (!this.props.otherUser) return null
        gm.username = this.props.currUser.username
        gm.opponame = this.props.otherUser.username
        return(
            <div>
                <script type="text/javascript"></script>
                <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" style={{ width: '100%', height: '100%' }} />
            </div>
        );
    }
}


export default Game;
