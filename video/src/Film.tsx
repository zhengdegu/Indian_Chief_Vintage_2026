import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {Stage} from './Stage';
import {Hero} from './scenes/Hero';
import {Engine} from './scenes/Engine';
import {Craft} from './scenes/Craft';
import {Chassis} from './scenes/Chassis';
import {Edition} from './scenes/Edition';
import {Closing} from './scenes/Closing';
import {Brand} from './design';
import {content, filmFrames, length, start, currentShot} from './timeline';
import './style.css';

export const Film = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const index=currentShot(frame);
  return <AbsoluteFill className="film" style={{background:'#111110',overflow:'hidden'}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 58% 58%,#66605735,transparent 66%)'}}/>
    <Stage/>
    <AbsoluteFill style={{background:'linear-gradient(0deg,#111110 0%,transparent 20%,transparent 85%,#11111066 100%)',pointerEvents:'none'}}/>
    <Sequence name="01 · 整车亮相" from={start(0,fps)} durationInFrames={length(0,fps)} premountFor={fps}><Hero/></Sequence>
    <Sequence name="02 · 雷霆之心" from={start(1,fps)} durationInFrames={length(1,fps)} premountFor={fps}><Engine/></Sequence>
    <Sequence name="03 · 双色与皮革" from={start(2,fps)} durationInFrames={length(2,fps)} premountFor={fps}><Craft/></Sequence>
    <Sequence name="04 · 低伏姿态" from={start(3,fps)} durationInFrames={length(3,fps)} premountFor={fps}><Chassis/></Sequence>
    <Sequence name="05 · 限量印记" from={start(4,fps)} durationInFrames={length(4,fps)} premountFor={fps}><Edition/></Sequence>
    <Sequence name="06 · 经典回响" from={start(5,fps)} durationInFrames={length(5,fps)} premountFor={fps}><Closing/></Sequence>
    <Brand/>
    <div style={{position:'absolute',top:75,right:120,font:'18px Arial',color:'#bda37b',letterSpacing:4}}>STURGIS, SD <span style={{paddingLeft:30,color:'#716b62'}}>0{index+1} / 06</span></div>
    <div style={{position:'absolute',bottom:0,left:0,height:3,width:`${frame/(filmFrames-1)*100}%`,background:'#bda37b66'}}/>
    {content.soundtrack&&<Audio name="中文旁白 · 原创氛围配乐" src={staticFile(content.soundtrack)} premountFor={fps}/>}
    <AbsoluteFill style={{background:'#111110',pointerEvents:'none',opacity:interpolate(frame,[0,20,filmFrames-20,filmFrames-1],[1,0,0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}/>
  </AbsoluteFill>;
};
