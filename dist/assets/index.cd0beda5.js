import{T as Ne,G as Re,r as ke,o as Ee,a as Oe,c as je,S as He,P as Ue,V as De,A as qe,b as ne,d as Ve,e as Ke,B as ie,f as R,g as re,h as b,i as g,j as Je,M as P,C as Qe,k as A,l as Xe,m as Ye,n as Ze,W as $e,O as et,p as tt,q as ot}from"./vendor.3423afbd.js";const nt=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerpolicy&&(o.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?o.credentials="include":i.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}};nt();const S=20,x=2,se=Math.PI,k=1/4/S*Math.PI;let L=[],G=[];for(let n=0;n<S;n++)L[3*n]=x*Math.cos(se-n*k)+x,L[3*n+1]=x*Math.sin(se-n*k),L[3*n+2]=0,G[3*n]=x*Math.cos(n*k)-x,G[3*n+1]=x*Math.sin(n*k),G[3*n+2]=0;const q=100,it=.06;let _=[];for(let n=0;n<q;n++)_[3*n]=0,_[3*n+1]=it*n,_[3*n+2]=0;const ae=(n,s)=>{let r=[],t=s*Math.PI;for(let i=0;i<q;i++){let o=_[3*i],l=_[3*i+1];r[3*i]=o*Math.cos(t)-l*Math.sin(t)+n,r[3*i+1]=o*Math.sin(t)+l*Math.cos(t),r[3*i+2]=Math.random()}return r},rt=n=>{let s=[],r=n*Math.PI;for(let t=0;t<S;t++){let i=L[3*t],o=L[3*t+1];s[3*t]=i*Math.cos(r)-o*Math.sin(r),s[3*t+1]=i*Math.sin(r)+o*Math.cos(r),s[3*t+2]=Math.random()}return s},st=n=>{let s=[],r=n*Math.PI;for(let t=0;t<S;t++){let i=G[3*t],o=G[3*t+1];s[3*t]=i*Math.cos(r)-o*Math.sin(r),s[3*t+1]=i*Math.sin(r)+o*Math.cos(r),s[3*t+2]=Math.random()}return s},le=n=>{let s=new Float32Array(n);for(let r=0;r<n;r++)s[r]=Math.random();return s},at=new Ne,ce=n=>new Promise((s,r)=>{at.load(n,t=>{s(t)},t=>{},t=>{r(t)})}),lt=new Re,ct=n=>new Promise((s,r)=>{lt.load(n,t=>{s(t)},t=>{},t=>{r(t)})});const dt={setup(n){const s="./texture/door_left.png",r="./texture/door_right.png",t="./model/RobotExpressive.glb",i=new tt;let o,l,m,T,V=ke(null),y;const de=()=>{o=new He},ue=()=>{const w=window.innerWidth/window.innerHeight;l=new Ue(60,w,.1,1e3),l.position.set(0,0,20),l.lookAt(new De(0,0,0))},we=()=>{const w=new qe(1842204);w.intensity=1,o.add(w);const c=new ne(16777215,1);c.position.set(-1.5,1.5,10),c.target.position.set(-1.5,-2,8),c.castShadow=!0,c.shadow.mapSize.width=2048,c.shadow.mapSize.height=2048,c.shadow.camera.near=1,c.shadow.camera.far=100,c.shadow.camera.fov=30,c.penumbra=1,o.add(c),o.add(c.target);const d=new ne(16777215,1);d.position.set(1.5,1.5,10),d.target.position.set(1.5,-2,8),d.castShadow=!0,d.shadow.mapSize.width=2048,d.shadow.mapSize.height=2048,d.shadow.camera.near=1,d.shadow.camera.far=100,d.shadow.camera.fov=30,d.penumbra=1,o.add(d),o.add(d.target)},pe=async()=>{const w=new Ve({size:.15,sizeAttenuation:!0,transparent:!0,opacity:.8,color:16777215,depthWrite:!1,blending:Ke,vertexColors:!0}),c=8,d=S*3*c,ge=le(d);let E=[];for(let e=0;e<4;e++)E=E.concat(rt(-1*e/12)).concat(st(e/12));const z=new ie;z.setAttribute("color",new R(ge,3)),z.setAttribute("position",new R(new Float32Array(E),3)),z.attributes.position.needsUpdate=!0;const Me=new re(z,w),W=new b;W.add(Me),W.visible=!1,W.scale.set(0,0,0);const p=new b;for(let e=0;e<60;e++){let oe=W.clone();oe.position.set(16*Math.random()-8,4*Math.random()+5,-2*Math.random()),p.add(oe)}p.position.set(0,0,-2),o.add(p);const ye=15,be=q*3*ye,Pe=le(be);let v=[];for(let e=0;e<10;e++)v=v.concat(ae(.3*e,0));for(let e=1;e<6;e++)v=v.concat(ae(-.2*e,.03*e));const I=new ie;I.setAttribute("color",new R(Pe,3)),I.setAttribute("position",new R(new Float32Array(v),3)),I.attributes.position.needsUpdate=!0;const xe=new re(I,w),M=new b;M.position.set(3,1,-2),M.add(xe),M.visible=!1,M.scale.set(0,0,0),o.add(M);let a={num:0},ve=new g.Tween(a).to({num:1},800).onStart(()=>{for(let e=0;e<20;e++)p.children[e].visible=!0}).onUpdate(()=>{for(let e=0;e<20;e++)p.children[e].scale.set(a.num,a.num,a.num)}),Ce=new g.Tween(a).to({num:1},800).onStart(()=>{M.visible=!0;for(let e=20;e<40;e++)p.children[e].visible=!0}).onUpdate(()=>{M.scale.set(a.num,a.num,a.num);for(let e=20;e<40;e++)p.children[e].scale.set(a.num,a.num,a.num)}).delay(800),Ae=new g.Tween(a).to({num:1},800).onStart(()=>{for(let e=40;e<60;e++)p.children[e].visible=!0}).onUpdate(()=>{for(let e=40;e<60;e++)p.children[e].scale.set(a.num,a.num,a.num)}).delay(1600),u=await ct(t);u.scene.traverse(e=>{e.isMesh&&(e.castShadow=!0)}),u.scene.position.set(.5,-5,4),u.scene.scale.set(.6,.6,.6),u.scene.visible=!1,y=new Je(u.scene);let O=u.animations,Se=y.clipAction(O[3]),J=y.clipAction(O[6]),Q=y.clipAction(O[12]);Q.play(),o.add(u.scene);const h=new b,X=new P({color:8988460}),Le=new Qe(.3,.3),Y=new A(Le,X);Y.position.y=.4;const Ge=new Xe(.15,.15,.8),_e=new A(Ge,X);h.position.set(-.5,-4.6,-2),h.castShadow=!0,h.add(Y),h.add(_e),h.visible=!1,o.add(h);let Z=new g.Tween(h.position).to({y:2},500).onStart(()=>{u.scene.rotation.y=0,Se.play()}).onComplete(()=>{h.visible=!1}).delay(500);Z.chain(ve,Ce,Ae);let $=new g.Tween(u.scene.position).to({z:-2},1e3).onComplete(()=>{J.enabled=!1});$.chain(Z);let ee=new g.Tween(u.scene.rotation).to({y:Math.PI},1e3).onComplete(()=>{Q.enabled=!1,J.play()}).delay(800);ee.chain($);const Te=new Ye(window.innerWidth,window.innerHeight),ze=new P({color:15122290}),B=new A(Te,ze);B.position.set(0,-5,0),B.receiveShadow=!0,B.rotation.x=-.5*Math.PI,o.add(B);const C=3,j=6,te=new Ze(C,j,.5),We=await ce(s),Ie=await ce(r),Be=new P({map:We}),Fe=new P({map:Ie}),f=new P({color:6030336}),F=new b,H=new A(te,[f,f,f,new P({color:16777215}),Be,f]);H.castShadow=!0,H.position.x=C/2,F.position.set(-C,j/2-5,8),F.add(H),o.add(F);const N=new b,U=new A(te,[f,f,f,f,Fe,f]);U.castShadow=!0,U.position.x=-C/2,N.position.set(C,j/2-5,8),N.add(U),o.add(N);let D={deg:0};new g.Tween(D).to({deg:.35*Math.PI},2e3).onStart(()=>{u.scene.visible=!0,h.visible=!0}).onUpdate(()=>{F.rotation.y=D.deg,N.rotation.y=-D.deg}).start().chain(ee)},he=()=>{m=new $e({antialias:!0}),m.setPixelRatio(window.devicePixelRatio),m.setSize(window.innerWidth,window.innerHeight),m.shadowMap.enabled=!0,V.value.appendChild(m.domElement)},K=()=>{requestAnimationFrame(K),m.render(o,l),T&&T.update(),g.update();let w=i.getDelta();y&&y.update(w)},fe=()=>{T=new et(l,m.domElement),T.target.set(0,0,0)},me=()=>{l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight)};return Ee(()=>{de(),ue(),we(),pe(),he(),K(),fe(),window.addEventListener("resize",me,!1)}),(w,c)=>(Oe(),je("div",{class:"container",ref_key:"container",ref:V},null,512))}};ot(dt).mount("#app");