---
theme: qklhk-chocolate
highlight: agate
---
# 前言
今年过年由于疫情又没回家，就抽空看了看**WebGL编程指南**和**Three.js开发指南**，为了练手，就简单实现了一下冬奥开幕式上的迎客松效果，纯小白，这篇文章主要是记录这次实践过程，涉及的也都是threejs最基础的内容，那我们就开始吧...

# 效果
效果图如下，也可以点击链接预览 https://awebgl.vercel.app/ 先是大门打开的一个动作，接着机器人是threejs官网的一个例子，最后就是烟花飞上天空爆炸成迎客松的一个效果。

![截屏2022-03-09 下午7.12.42.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9649c3cd3d464e34aa33984cd7687655~tplv-k3u1fbpfcp-watermark.image?)
# 环境
用的vite+vue3，步骤如下，threejs的api比较长，目前我是记不住（捂脸），npm安装了@types/three，vscode就有代码提示功能了，还安装了一个动画库tween.js。

```js
npm create vite@latest three3d --template vue
cd three3d
npm install @tweenjs/tween.js @types/three three -S
```
# 实现

个人感觉做3d，完全可以把自己当成一个导演（偷笑），相机放在哪个位置、灯光在哪儿等等，不然就容易遇到满屏黑，下面是我这个例子的简图，大家按照自己的习惯来构建就好。

![IMG_0101.PNG](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d706f78aee94b31aec4a60028640d48~tplv-k3u1fbpfcp-watermark.image?)

### 场景和相机
首先需要创建一个场景，有了场景才能添加光照、图元。
然后这个例子使用的是透视摄像机PerspectiveCamera(fov,aspect,near,far), 它可以提供一个近大远小的3D视觉效果，aspect通常设为画布的长宽比，这里我选取的是整个页面，所以就是window.innerWidth/window.innerHeight，最后把相机指向中心(0,0,0)。
```js
//App.vue
const createScene = ()=>{
    scene = new THREE.Scene(); //创建场景
}
const createCamera = ()=>{
    const scale = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(60,scale,0.1,1000);
    camera.position.set(0,0,20)
    camera.lookAt(new THREE.Vector3(0,0,0))
}
```

### 光照
首先添加的是环境光，AmbientLight只是简单地将材质的颜色与光照颜色进行叠加，再乘以光照强度，可以参考下面代码的注释部分，由于是夜晚，我选取了较暗的颜色。同样由于是夜晚，没有选用太阳光照那样的平行光，而是在大门的左右添加了一个类似路灯效果的聚光灯光源。
```js
//App.vue
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
    //同理添加右侧灯光...
}
```
### 图元模型
相机光照舞台都搭好了，接着就该是我们的主角们出场了。

小树枝：可见下面的示意图，选取圆的一部分，移到原点，然后弧线绕z轴旋转，左右各生成4条，旋转后点的计算公式，可以直接套用数学公式，这里需要提到的一点，threejs使用的是右手坐标系，z轴垂直屏幕指向外，所以示意图是绕z轴逆时针旋转了θ'，右边四条弧线我传的也是负数。最后把这个小树枝的scale设置为0，然后放大到1，就简单实现了一个爆炸效果。

迎客松整个树枝：首先把上面的小树枝克隆60个，然后在一个16 * 4 * 2的立方体区域里，随机选取其中60个位置设置给小树枝，最后再分3批依次绽放。

迎客松树干：斜着5条和竖着10条直线，实现效果和上面类似，大家可以直接看源码，我就不再介绍了。

![IMG_0100.PNG](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/192bbf1ad8424e22befc209ad43be5dd~tplv-k3u1fbpfcp-watermark.image?)
```js
//App.vue
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
  const circleNum = 8; //8条弧线
  const circlePointNum = circlePoint*3*circleNum;
  const circleColors = getColors(circlePointNum);
  let circleArr = [];
  //右4条弧线左4条弧线
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
```

机器人：这个是threejs官网的一个例子，链接https://threejs.org/examples/#webgl_animation_skinning_morph ，加上这个是因为开门放烟花感觉有点单调，就把这个机器人用上了，用了挥手、跑、跳三个动作。需要提到的是，在加载机器人模型时，如果不等待加载完，就进行下一步操作，会出现黑屏，感觉跟vue框架也有关系，最后就用Promise统一封装了。
```js
//App.vue
  let people = await loadMesh(peopleModel);
  people.scene.traverse((child)=>{
    if (child.isMesh) {
      child.castShadow = true;
    }
  })
  people.scene.position.set(0.5, -5, 4);
  people.scene.scale.set(0.6, 0.6, 0.6);
  //加载动画
  mixer = new THREE.AnimationMixer(people.scene);
  let animations = people.animations;
  let jumpClip = mixer.clipAction(animations[3])
  let runClip = mixer.clipAction(animations[6])
  let waveClip = mixer.clipAction(animations[12])
  waveClip.play()
  scene.add(people.scene)
```

大门：这块需要提到的是，图元在旋转的时候都是绕着中心点的，我用了组合Group，左边的门往右偏移半个门的宽度，同理右边的门往左偏移，然后再把Group分别向左、右各平移一整个门的宽度，最后Group绕y轴旋转就达到开门的效果了，大门的前面贴了纹理，其它面都是红色，在官网没找到立方体面的对应纹理顺序，我试了一下应该是[右,左,上,下,前,后]。
```js
//App.vue
  const doorWidth = 3;
  const doorHeight = 6;
  const cubeGeometry = new THREE.BoxGeometry(doorWidth,doorHeight,0.5);
  const leftdoorTexture = await loadTexture(leftDoorPic);
  const rightdoorTexture = await loadTexture(rightDoorPic);
  const cubeMaterial1 = new THREE.MeshPhongMaterial({color:0x5C0400});
  const cubeMaterial2 = new THREE.MeshPhongMaterial({map:leftdoorTexture});
  const cubeMaterial3 = new THREE.MeshPhongMaterial({map:rightdoorTexture});
  const doorGroup1 = new THREE.Group()
  const doorCube1 = new THREE.Mesh(cubeGeometry,[cubeMaterial1,cubeMaterial1,cubeMaterial1,cubeMaterial1,cubeMaterial2,cubeMaterial1]);
  doorCube1.castShadow = true;
  doorCube1.position.x = doorWidth/2;
  doorGroup1.position.set(-doorWidth,doorHeight/2-5,8);
  doorGroup1.add(doorCube1)
  scene.add(doorGroup1);
  //同理添加右侧大门...
```
最后简单整理一下整个动画过程吧，大概就是大门打开-》机器人挥手-》跑向炮竹-》炮竹起飞-》烟花绽放。动画用的是tweenjs库，api挺简单的，我就不多说了。
### 渲染
首先创建WebGLRenderer渲染器，设置设备像素比、开启阴影等操作，最后把domElement也就是一个canvas添加到页面里。
然后又创建了一个update方法，调用requestAnimationFrame来更新动画，为了方便查看，创建了OrbitControls轨道控制器，可以使相机围绕目标(0,0,0)进行轨道运动。
```js
//App.vue
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
    orbitControls&&orbitControls.update();
    TWEEN.update();
    let time = clock.getDelta()
    mixer&&mixer.update(time)
  }
```
### onMounted
上面的方法都创建好了，最后在onMounted调用就可以了，展示一个三维场景，基本就是下面几步。
```js
//App.vue
onMounted(()=>{
  createScene(); //创建场景
  createCamera(); //创建相机
  createLight(); //创建光照
  createMesh(); //加载模型
  createRender(); //创建渲染
  createControl(); 
  updateRender(); //更新渲染
  window.addEventListener('resize', onWindowResize, false);
})
```

### 最后
附源码地址：https://github.com/chencld/three3d

好久没写文章了，拖拖拉拉了半个月，终于写完了，码字不易，还请大家多多点赞，也欢迎讨论区交流，谢谢~









