import React, { Component } from 'react';
import './Game.css';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Mesh } from "@babylonjs/core";
import {GUI, GridMaterial} from "babylonjs-gui";


// This creates a basic Babylon Scene object (non-mesh)
var scene = new Scene(Engine);

// This creates and positions a free camera (non-mesh)
var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl( scene , true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

var cube1 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);


var cube2 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
var cube3 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
var cube4 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
var cube5 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
var cube6 = MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
// Move the sphere upward 1/2 its height

cube1.position.x = 0;
//cube2.position.y = 1;
cube1.position.z = 1.5;

cube2.position.x = 1;
//cube2.position.y = 1;
cube2.position.z = 0.5;

cube3.position.x = -1;
//cube3.position.y = 1;
cube3.position.z = -0.5;

cube4.position.x = -2;
//cube4.position.y = 1;
cube4.position.z = -1.5;

cube5.position.x = 2;
//cube5.position.y = 1;
cube5.position.z = -2.5;

cube6.position.x = -1;

//cube6.position.y = 1;
cube6.position.z = -3.5;

var box = MeshBuilder.CreateBox("box", {height: 0.5, width: 0.5, depth: 0.5}, scene);
box.position.x = 1;
//cube5.position.y = 1;
box.position.z = -2.5;
var greenMaterial = new StandardMaterial(scene);
greenMaterial.alpha = 1;
var redMaterial = new StandardMaterial(scene);
redMaterial.alpha = 1;
greenMaterial.diffuseColor = new Color3(0.0, 1.0, 0.0);
box.material = greenMaterial;
cube1.material = greenMaterial;
cube2.material = greenMaterial;


var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

var button1 = GUI.Button.CreateSimpleButton("but1", "2D");
button1.left = "-100"
button1.top = "140"
button1.width = "40px"
button1.height = "30px";
button1.color = "white";
button1.cornerRadius = 0;
button1.background = "green";
button1.onPointerUpObservable.add(function() {
    alert("clicked 2d button!");
    redMaterial.diffuseColor = new Color3(1.0, 0.0, 0.0);
    cube6.material = redMaterial;
});
advancedTexture.addControl(button1);

let uManager    =   new GUI.GUI3DManager(scene);
let myBtn       =   new GUI.MeshButton3D(box, 'btnName');
uManager.addControl(myBtn);
//console.log(box.metadata);

myBtn.onPointerClickObservable.add(function(){

    redMaterial.diffuseColor = new Color3(1.0, 0.0, 0.0);
    box.material = redMaterial;
    alert("clicked 3d box RED!");
});

//myBtn.onPointerClickObservable = () => {
//    alert("click");
//}

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = Mesh.CreateGround("ground1", 5, 12, 2, scene);
ground.material = new GridMaterial("groundMaterial", scene);
ground.material.majorUnitFrequency = 1;
ground.material.minorUnitVisibility  = 0;

ground.material.gridOffset = new Vector3(0.5, 0, 0);






class Game extends Component {

    render() {
        return scene

    }
}

export default Game;
