import React, { Component } from 'react';
import './Game.css';
import * as BABYLON from 'babylonjs';
import {GUI, GridMaterial} from "babylonjs-gui";


const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);
class Game extends Component {

    render() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl( scene , true);
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        var cube1 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        var cube2 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        var cube3 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        var cube4 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        var cube5 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        var cube6 = BABYLON.MeshBuilder.CreateBox("cube", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        cube1.position.x = 0;
        cube1.position.z = 1.5;
        cube2.position.x = 1;
        cube2.position.z = 0.5;
        cube3.position.x = -1;
        cube3.position.z = -0.5;
        cube4.position.x = -2;
        cube4.position.z = -1.5;
        cube5.position.x = 2;
        cube5.position.z = -2.5;
        cube6.position.x = -1;
        cube6.position.z = -3.5;
        var box = BABYLON.MeshBuilder.CreateBox("box", {height: 0.5, width: 0.5, depth: 0.5}, scene);
        box.position.x = 1;
        //cube5.position.y = 1;
        box.position.z = -2.5;
        var greenMaterial = new BABYLON.StandardMaterial(scene);
        greenMaterial.alpha = 1;
        var redMaterial = new BABYLON.StandardMaterial(scene);
        redMaterial.alpha = 1;
        greenMaterial.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
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
            redMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
            cube6.material = redMaterial;
        });
        advancedTexture.addControl(button1);
        let uManager    =   new GUI.GUI3DManager(scene);
        let myBtn       =   new GUI.MeshButton3D(box, 'btnName');
        uManager.addControl(myBtn);
        myBtn.onPointerClickObservable.add(function(){

            redMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
            box.material = redMaterial;
            alert("clicked 3d box RED!");
        });
        var ground = BABYLON.Mesh.CreateGround("ground1", 5, 12, 2, scene);
        ground.material = new GridMaterial("groundMaterial", scene);
        ground.material.majorUnitFrequency = 1;
        ground.material.minorUnitVisibility  = 0;
        ground.material.gridOffset = new BABYLON.Vector3(0.5, 0, 0);
        engine.runRenderLoop(() => {
            scene.render();
        });
        return scene
    }
}

export default Game;
