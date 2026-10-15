import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {currentShot, length, start} from './timeline';

type Pose = {position:number[];target:number[];offset:number;vertical:number;fov:number};
const shots: {a:Pose;b:Pose}[] = [
  {a:{position:[3.2,1.8,5.2],target:[0,.53,0],offset:.14,vertical:.12,fov:26},b:{position:[2.55,1.55,4.75],target:[0,.53,0],offset:.14,vertical:.12,fov:26}},
  {a:{position:[1.15,1.04,2.62],target:[.02,.48,0],offset:.22,vertical:.045,fov:26},b:{position:[.72,.88,2.45],target:[.02,.48,0],offset:.22,vertical:.045,fov:26}},
  {a:{position:[-1.55,1.82,2.8],target:[-.10,.73,0],offset:-.21,vertical:.07,fov:26},b:{position:[-.94,1.53,2.55],target:[-.10,.73,0],offset:-.21,vertical:.07,fov:26}},
  {a:{position:[.10,1.22,4.82],target:[-.03,.50,0],offset:.04,vertical:.10,fov:28},b:{position:[-.12,1.04,4.65],target:[-.03,.50,0],offset:.04,vertical:.10,fov:28}},
  {a:{position:[-3.15,1.61,4.0],target:[-.08,.53,0],offset:-.15,vertical:.09,fov:27},b:{position:[-2.66,1.45,4.08],target:[-.08,.53,0],offset:-.15,vertical:.09,fov:27}},
  {a:{position:[2.9,1.6,4.95],target:[0,.53,0],offset:.12,vertical:.13,fov:27},b:{position:[2.55,1.52,5.1],target:[0,.53,0],offset:.12,vertical:.13,fov:27}},
];
const mix = (a:number,b:number,t:number) => a+(b-a)*t;
const ease = (x:number) => {const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
const poseMix = (a:Pose,b:Pose,t:number):Pose => ({position:a.position.map((v,i)=>mix(v,b.position[i],t)),target:a.target.map((v,i)=>mix(v,b.target[i],t)),offset:mix(a.offset,b.offset,t),vertical:mix(a.vertical,b.vertical,t),fov:mix(a.fov,b.fov,t)});

const World = ({absoluteFrame}:{absoluteFrame:number}) => {
  const {gl,scene,camera,invalidate} = useThree();
  const {width,height} = useVideoConfig();
  const [model,setModel] = useState<THREE.Group|null>(null);
  const contact=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
    const ctx=canvas.getContext('2d')!;const gradient=ctx.createRadialGradient(128,128,10,128,128,125);
    gradient.addColorStop(0,'rgba(0,0,0,.64)');gradient.addColorStop(.5,'rgba(0,0,0,.3)');gradient.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);return new THREE.CanvasTexture(canvas);
  },[]);
  const [ready] = useState(()=>delayRender('Loading motorcycle and studio reflections',{timeoutInMilliseconds:90000}));
  const index=currentShot(absoluteFrame);
  const local=absoluteFrame-start(index);
  let pose=poseMix(shots[index].a,shots[index].b,ease(Math.max(0,local-22)/Math.max(1,length(index)-22)));
  if(index>0&&local<22) pose=poseMix(shots[index-1].b,shots[index].a,ease(local/22));

  useLayoutEffect(()=>{
    const c=camera as THREE.PerspectiveCamera;
    c.position.set(pose.position[0],pose.position[1],pose.position[2]);
    c.lookAt(pose.target[0],pose.target[1],pose.target[2]);
    c.fov=pose.fov;c.aspect=width/height;
    c.setViewOffset(width,height,-width*pose.offset,-height*pose.vertical,width,height);
    c.updateProjectionMatrix();c.updateMatrixWorld();
    invalidate();
  },[absoluteFrame, camera, width,height,invalidate]);

  useEffect(()=>{
    gl.toneMapping=THREE.ACESFilmicToneMapping; gl.toneMappingExposure=.98;
    gl.outputColorSpace=THREE.SRGBColorSpace;gl.setClearColor(0x111110,0);
    gl.shadowMap.enabled=true;gl.shadowMap.type=THREE.PCFSoftShadowMap;gl.shadowMap.autoUpdate=false;
    const pmrem=new THREE.PMREMGenerator(gl);const room=new RoomEnvironment();
    const env=pmrem.fromScene(room,.04);scene.environment=env.texture;scene.environmentIntensity=.8;
    room.dispose();pmrem.dispose();scene.fog=new THREE.FogExp2(0x111110,.055);
    const decoder=new DRACOLoader();decoder.setDecoderPath(staticFile('draco/'));decoder.setWorkerLimit(2);
    const loader=new GLTFLoader();loader.setDRACOLoader(decoder);
    let disposed=false;
    loader.load(staticFile('models/chief-vintage.glb'),gltf=>{
      if(disposed)return;
      gltf.scene.traverse(object=>{
        const mesh=object as THREE.Mesh;
        if(!mesh.isMesh)return;
        mesh.castShadow=true;mesh.receiveShadow=false;
        for(const raw of Array.isArray(mesh.material)?mesh.material:[mesh.material]){
          const material=raw as THREE.MeshStandardMaterial;
          material.envMapIntensity=1;
          if(material.map)material.map.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());
          if(/Decal|Emblem|Photograph/i.test(material.name)){material.depthWrite=false;material.polygonOffset=true;material.polygonOffsetFactor=-1;}
        }
      });
      setModel(gltf.scene);decoder.dispose();
    },undefined,error=>cancelRender(error));
    return()=>{disposed=true;env.dispose();decoder.dispose();};
  },[gl,scene]);

  useLayoutEffect(()=>{
    if(!model)return;
    gl.shadowMap.needsUpdate=true;
    gl.compile(scene,camera);gl.render(scene,camera);
    continueRender(ready);invalidate();
  },[model,ready,gl,scene,camera,invalidate]);

  return <>
    <hemisphereLight args={[0xe6ebf2,0x2b1914,.8]}/>
    <directionalLight color={0xffecd3} intensity={2.8} position={[1.8,4,3.4]} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-2.1} shadow-camera-right={2.1} shadow-camera-top={2.1} shadow-camera-bottom={-2.1} shadow-camera-near={.2} shadow-camera-far={12} shadow-bias={-.0001} shadow-normalBias={.015} shadow-radius={3}/>
    <directionalLight color={0xb8ccdf} intensity={2.5} position={[-2,2.6,-2.1]}/>
    <directionalLight color={0xffd8b6} intensity={1.5} position={[2.8,1.1,-1.5]}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.003,0]} receiveShadow><planeGeometry args={[100,100]}/><shadowMaterial transparent opacity={.18}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.002,0]}><planeGeometry args={[3.4,1.8]}/><meshBasicMaterial map={contact} transparent depthWrite={false} opacity={.8}/></mesh>
    {model&&<primitive object={model}/>}
  </>;
};

export const Stage = ({frameOverride}:{frameOverride?:number}) => {
  const frame=useCurrentFrame(); const {width,height}=useVideoConfig();
  return <ThreeCanvas width={width} height={height} frameloop="demand" shadows dpr={1} camera={{near:.02,far:80,fov:26,position:[3,1.7,5]}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} style={{position:'absolute',inset:0}}><World absoluteFrame={frameOverride??frame}/></ThreeCanvas>;
};
