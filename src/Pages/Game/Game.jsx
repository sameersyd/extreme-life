import React from "react";
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import * as BABYLON from '@babylonjs/core';
//import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine, scene } from "@babylonjs/core";
//import {GridMaterial} from '@babylonjs/materials';
import { GridMaterial } from "@babylonjs/materials/grid";
//import * as GUI from '@babylonjs/core';
import * as GUI from "babylonjs-gui";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

//var box;


const onSceneReady = (scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    for(var i=0; i<12 ; i++){
        for(var j=0; j<11 ; j++){
            var box = [];
            box [j]= BABYLON.MeshBuilder.CreateBox("box", {height: 0.5, width: 0.5, depth: 0.5}, scene);
            box[j].position.x = -5 + j;
            box[j].position.z = 5.5 - i;
        
            var greenMaterial = new BABYLON.StandardMaterial(scene);
            greenMaterial.alpha = 1;
            var redMaterial = new BABYLON.StandardMaterial(scene);
            redMaterial.alpha = 1;
            greenMaterial.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
            box[j].material = greenMaterial;
        
        /*
            let uManager    =   new GUI.GUI3DManager(scene);
            let myBtn       =   new GUI.MeshButton3D(box[0], 'btnName');
            uManager.addControl(myBtn);
        
            myBtn.onPointerClickObservable.add(function(){
        
                redMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
                box[0].material = redMaterial;
                alert("clicked 3d box RED!");
            });
        */
        };
        };
    var ground = BABYLON.Mesh.CreateGround("ground1", 11, 12, 2, scene);
    ground.material = new GridMaterial("groundMaterial", scene);
    ground.material.majorUnitFrequency = 1;
    ground.material.minorUnitVisibility  = 0;

    ground.material.gridOffset = new BABYLON.Vector3(0.5, 0, 0);
    //BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
};



const Game = () => (

  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas" />
  </div>

  );
export default Game;
