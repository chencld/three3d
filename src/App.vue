<!--
 * @Author: lidan6
 * @Date: 2022-02-07 15:41:44
 * @LastEditors: lidan6
 * @LastEditTime: 2022-03-09 18:45:44
 * @Description: 
-->
<script setup>
  import { ref, onMounted } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import TWEEN from '@tweenjs/tween.js'
  import {
    circlePoint,
    linePoint,
    getLinePosition,
    getRightPosition,
    getLeftPosition,
    getColors,
    loadTexture,
    loadMesh,
  } from './utils/tool'
  const leftDoorPic = "./texture/door_left.png"
  const rightDoorPic = "./texture/door_right.png"
  const peopleModel ='./model/RobotExpressive.glb'
  
  const clock = new THREE.Clock();
  let scene;//创建场景
  let camera; //定义相机
  let renderer; //定义渲染
  let orbitControls; //定义控制器
  let container = ref(null);
  let mixer;

  const createScene = ()=>{
    scene = new THREE.Scene(); //创建场景
  }
  const createCamera = ()=>{
    const scale = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(60,scale,0.1,1000);
    camera.position.set(0,0,20)
    camera.lookAt(new THREE.Vector3(0,0,0))
  }

  const createLight = ()=>{
    // 环境光
    // 这里的颜色计算是 RBG 通道上的值分别对应相乘
    // 例: rgb(0.64,0.64,0.64) = rgb(0.8,0.8,0.8) * rgb(0.8,0.8,0.8) * 1
    // color = materialColor * light.color * light.intensity;
    const ambientLight = new THREE.AmbientLight(0x1c1c1c);
    ambientLight.intensity = 1;
    scene.add(ambientLight);
    // 聚光灯
    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(-1.5,1.5,10); 
    spotLight1.target.position.set(-1.5, -2, 8);
    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 2048;
    spotLight1.shadow.mapSize.height = 2048;
    spotLight1.shadow.camera.near = 1;
    spotLight1.shadow.camera.far = 100;
    spotLight1.shadow.camera.fov = 30;
    spotLight1.penumbra = 1;
    scene.add(spotLight1);
    scene.add(spotLight1.target);
    const spotLight2 = new THREE.SpotLight(0xffffff, 1);
    spotLight2.position.set(1.5,1.5,10); 
    spotLight2.target.position.set(1.5, -2, 8);
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 2048;
    spotLight2.shadow.mapSize.height = 2048;
    spotLight2.shadow.camera.near = 1;
    spotLight2.shadow.camera.far = 100;
    spotLight2.shadow.camera.fov = 30;
    spotLight2.penumbra = 1;
    scene.add(spotLight2);
    scene.add(spotLight2.target);
  }

  const createMesh = async ()=>{
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      color: 0xffffff,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    const circleNum = 8;
    const circlePointNum = circlePoint*3*circleNum;
    const circleColors = getColors(circlePointNum);
    let circleArr = [];
    //左4条弧线右4条弧线
    for(let i=0;i<4;i++){
      circleArr = circleArr.concat(getRightPosition(-1*i/12)).concat(getLeftPosition(i/12));
    }
    const circleGeometry = new THREE.BufferGeometry();
    circleGeometry.setAttribute("color",new THREE.BufferAttribute(circleColors,3))
    circleGeometry.setAttribute("position",new THREE.BufferAttribute(new Float32Array(circleArr),3))
    circleGeometry.attributes.position.needsUpdate = true;
    const circlepoints = new THREE.Points(circleGeometry,pointsMaterial);
    const circlegroup = new THREE.Group()
    circlegroup.add(circlepoints);
    circlegroup.visible = false
    circlegroup.scale.set(0,0,0)
    const flowerGroup = new THREE.Group();
    //60个随机小烟花
    for(let i=0;i<60;i++){
      let tgroup = circlegroup.clone();
      tgroup.position.set(16*Math.random()-8,4*Math.random()+5,-2*Math.random())
      flowerGroup.add(tgroup);
    }
    flowerGroup.position.set(0,0,-2)
    scene.add(flowerGroup);
    const lineNum = 15;
    //总点数
    const linePointNum = linePoint*3*lineNum; 
    const lineColors = getColors(linePointNum);
    let lineArr = []
    //10条竖着的线
    for(let i=0;i<10;i++){
      lineArr = lineArr.concat(getLinePosition(0.3*i,0))
    }
    //5条斜着的线
    for(let i=1;i<6;i++){
      lineArr = lineArr.concat(getLinePosition(-0.2*i,0.03*i))
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("color",new THREE.BufferAttribute(lineColors,3))
    lineGeometry.setAttribute("position",new THREE.BufferAttribute(new Float32Array(lineArr),3))
    lineGeometry.attributes.position.needsUpdate = true;
    const linepoints = new THREE.Points(lineGeometry,pointsMaterial);
    const linegroup = new THREE.Group()
    linegroup.position.set(3,1,-2)
    linegroup.add(linepoints);
    linegroup.visible = false;
    linegroup.scale.set(0,0,0)
    scene.add(linegroup);

    let scaleobj = {num:0}
    let tween1 = new TWEEN.Tween(scaleobj)
    .to({num:1}, 800)
    .onStart(()=>{
      for(let i=0;i<20;i++){
        flowerGroup.children[i].visible = true;
      }
    })
    .onUpdate(()=>{
      for(let i=0;i<20;i++){
        flowerGroup.children[i].scale.set(scaleobj.num,scaleobj.num,scaleobj.num);
      }
    })
    let tween2 = new TWEEN.Tween(scaleobj)
    .to({num:1}, 800)
    .onStart(()=>{
      linegroup.visible = true;
      for(let i=20;i<40;i++){
        flowerGroup.children[i].visible = true;
      }
    })
    .onUpdate(()=>{   
      linegroup.scale.set(scaleobj.num,scaleobj.num,scaleobj.num);
      for(let i=20;i<40;i++){
        flowerGroup.children[i].scale.set(scaleobj.num,scaleobj.num,scaleobj.num);
      }
    })
    .delay(800)
    let tween3 = new TWEEN.Tween(scaleobj)
    .to({num:1}, 800)
    .onStart(()=>{
      for(let i=40;i<60;i++){
        flowerGroup.children[i].visible = true;
      }
    })
    .onUpdate(()=>{
      for(let i=40;i<60;i++){
        flowerGroup.children[i].scale.set(scaleobj.num,scaleobj.num,scaleobj.num);
      }
    })
    .delay(1600)
    
    //机器人
    let people = await loadMesh(peopleModel);
    people.scene.traverse((child)=>{
      if (child.isMesh) {
        child.castShadow = true;
      }
    })
    people.scene.position.set(0.5, -5, 4);
    people.scene.scale.set(0.6, 0.6, 0.6);
    people.scene.visible = false;
    //加载动画
    mixer = new THREE.AnimationMixer(people.scene);
    let animations = people.animations;
    let jumpClip = mixer.clipAction(animations[3])
    let runClip = mixer.clipAction(animations[6])
    let waveClip = mixer.clipAction(animations[12])
    waveClip.play()
    scene.add(people.scene)
    //炮竹
    const arrowGroup = new THREE.Group()
    const arrowMaterial = new THREE.MeshPhongMaterial({color: 0x89272C});
    const arrowGeometry = new THREE.ConeGeometry(0.3,0.3);
    const arrow = new THREE.Mesh(arrowGeometry,arrowMaterial);
    arrow.position.y = 0.4;
    const sphereGeometry = new THREE.CylinderGeometry(0.15,0.15,0.8);
    const sphere = new THREE.Mesh(sphereGeometry,arrowMaterial);
    arrowGroup.position.set(-0.5,-4.6,-2)
    arrowGroup.castShadow = true;
    arrowGroup.add(arrow)
    arrowGroup.add(sphere);
    arrowGroup.visible = false;
    scene.add(arrowGroup);
    let tween4 = new TWEEN.Tween(arrowGroup.position)
    .to({y: 2}, 500)
    .onStart(()=>{
      people.scene.rotation.y = 0;
      jumpClip.play()
    })
    .onComplete(()=>{
      arrowGroup.visible = false;
    })
    .delay(500)
    tween4.chain(tween1,tween2,tween3);

    let tween5 = new TWEEN.Tween(people.scene.position)
    .to({z:-2}, 1000)
    .onComplete(()=>{
      runClip.enabled = false;
    })
    tween5.chain(tween4)

    let tween6 = new TWEEN.Tween(people.scene.rotation)
    .to({y: Math.PI}, 1000)
    .onComplete(()=>{
      waveClip.enabled = false;
      runClip.play()
    })
    .delay(800)
    tween6.chain(tween5)

    //地面和大门
    const planeGeometry = new THREE.PlaneGeometry(window.innerWidth,window.innerHeight);
    const planeMateril = new THREE.MeshPhongMaterial({color:0xE6BF72})
    const plane = new THREE.Mesh(planeGeometry,planeMateril);
    plane.position.set(0,-5,0);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5*Math.PI;
    scene.add(plane);
    const doorWidth = 3;
    const doorHeight = 6;
    const cubeGeometry = new THREE.BoxGeometry(doorWidth,doorHeight,0.5);
    const leftdoorTexture = await loadTexture(leftDoorPic);
    const rightdoorTexture = await loadTexture(rightDoorPic);
    const cubeMaterial1 = new THREE.MeshPhongMaterial({map:leftdoorTexture});
    const cubeMaterial3 = new THREE.MeshPhongMaterial({map:rightdoorTexture});
    const cubeMaterial2 = new THREE.MeshPhongMaterial({color:0x5C0400});
    const doorGroup1 = new THREE.Group()
    const doorCube1 = new THREE.Mesh(cubeGeometry,[cubeMaterial2,cubeMaterial2,cubeMaterial2,new THREE.MeshPhongMaterial({color:0xffffff}),cubeMaterial1,cubeMaterial2]);
    doorCube1.castShadow = true;
    doorCube1.position.x = doorWidth/2;
    doorGroup1.position.set(-doorWidth,doorHeight/2-5,8);
    doorGroup1.add(doorCube1)
    scene.add(doorGroup1);
    const doorGroup2 = new THREE.Group()
    const doorCube2 = new THREE.Mesh(cubeGeometry,[cubeMaterial2,cubeMaterial2,cubeMaterial2,cubeMaterial2,cubeMaterial3,cubeMaterial2]);
    doorCube2.castShadow = true;
    doorCube2.position.x = - doorWidth/2
    doorGroup2.position.set(doorWidth,doorHeight/2-5,8)
    doorGroup2.add(doorCube2)
    scene.add(doorGroup2);
    let degObj = {deg: 0};
    let tween7 = new TWEEN.Tween(degObj)
    .to({deg: 0.35 * Math.PI}, 2000)
    .onStart(()=>{
      people.scene.visible = true;
      arrowGroup.visible = true;
    })
    .onUpdate(()=>{
      doorGroup1.rotation.y = degObj.deg;
      doorGroup2.rotation.y = - degObj.deg;
    })
    .start()
    tween7.chain(tween6);
  }
  const createRender = ()=>{
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.value.appendChild(renderer.domElement);
  }
  const updateRender = ()=>{
    requestAnimationFrame(updateRender)
    renderer.render(scene, camera);
    orbitControls&&orbitControls.update(); //更新控制器
    TWEEN.update();
    let time = clock.getDelta()
    mixer&&mixer.update(time); //更新机器人动画
  }
  const createControl = ()=>{
    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.target.set(0, 0, 0);
  }
  const onWindowResize = ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  onMounted(()=>{
    createScene();//创建场景
    createCamera(); //创建相机
    createLight(); //创建光照
    createMesh(); //创建图元加载模型
    createRender(); //创建渲染
    updateRender();
    createControl(); 
    window.addEventListener('resize', onWindowResize, false);
  })
</script>
<template>
  <div class="container" ref="container"></div>
</template>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
