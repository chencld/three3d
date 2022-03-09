/*
 * @Author: lidan6
 * @Date: 2022-02-24 11:38:31
 * @LastEditors: lidan6
 * @LastEditTime: 2022-03-09 11:35:08
 * @Description: 
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
const circlePoint = 20;
const radius = 2;
const startDeg = Math.PI;
const stepDeg = 1/4/circlePoint*Math.PI;
let rightPositions = [];
let leftPositions = [];
for(let i=0;i<circlePoint;i++){
  rightPositions[3*i] = radius*Math.cos(startDeg-i*stepDeg)+radius;
  rightPositions[3*i+1] = radius*Math.sin(startDeg-i*stepDeg);
  rightPositions[3*i+2] = 0;

  leftPositions[3*i] = radius*Math.cos(i*stepDeg)-radius;
  leftPositions[3*i+1] = radius*Math.sin(i*stepDeg);
  leftPositions[3*i+2] = 0;
}
const linePoint = 100;
const stepNum = 0.06;
let linePositions = [];
for(let i=0;i<linePoint;i++){
  linePositions[3*i] = 0;
  linePositions[3*i+1] = stepNum*i;
  linePositions[3*i+2] = 0;
}
const getLinePosition = (xStep,degNum)=>{
  let aposition = [];
  let deg = degNum*Math.PI;
  for(let i=0;i<linePoint;i++){
    let x1 = linePositions[3*i];
    let y1 = linePositions[3*i+1];
    aposition[3*i] = x1*Math.cos(deg)-y1*Math.sin(deg)+xStep;
    aposition[3*i+1] = x1*Math.sin(deg)+y1*Math.cos(deg);
    aposition[3*i+2] = Math.random();
  }
  return aposition;
}
const getRightPosition = (degNum)=>{
  let aposition = [];
  let deg = degNum*Math.PI;
  for(let i=0;i<circlePoint;i++){
    let x1 = rightPositions[3*i];
    let y1 = rightPositions[3*i+1];
    aposition[3*i] = x1*Math.cos(deg)-y1*Math.sin(deg);
    aposition[3*i+1] = x1*Math.sin(deg)+y1*Math.cos(deg);
    aposition[3*i+2] = Math.random();
  }
  return aposition;
}
const getLeftPosition = (degNum)=>{
  let aposition = [];
  let deg = degNum*Math.PI;
  for(let i=0;i<circlePoint;i++){
    let x1 = leftPositions[3*i];
    let y1 = leftPositions[3*i+1];
    aposition[3*i] = x1*Math.cos(deg)-y1*Math.sin(deg);
    aposition[3*i+1] = x1*Math.sin(deg)+y1*Math.cos(deg);
    aposition[3*i+2] = Math.random();
  }
  return aposition;
}

const getColors = (total)=>{
  let colors = new Float32Array(total);
  for(let i=0;i<total;i++){
    colors[i] = Math.random()
  }
  return colors;
}

const textureLoader = new THREE.TextureLoader();
const loadTexture = (url)=>{
  return new Promise((resolve,reject)=>{
    textureLoader.load(url,
      (texture)=>{
        resolve(texture)
      },
      (progress)=>{
        // console.log(progress)
      },
      (error)=>{
        reject(error)
      }
    );
  })
}
const gLTFLoader = new GLTFLoader();
const loadMesh = (url)=>{
  return new Promise((resolve,reject)=>{
    gLTFLoader.load(url,
      (mesh)=>{
        resolve(mesh)
      },
      (progress)=>{
        // console.log(progress)
      },
      (error)=>{
        reject(error)
      }
    );
  })
}
export {
  circlePoint,
  linePoint,
  getColors,
  getLinePosition,
  getRightPosition,
  getLeftPosition,
  loadTexture,
  loadMesh
}