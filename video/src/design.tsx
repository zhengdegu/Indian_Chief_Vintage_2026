import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {scenes} from './timeline';
import {Stage} from './Stage';
export const colors={ivory:'#eee8db',gold:'#bda37b',muted:'#ada496',red:'#9f282a',black:'#111110'};
export const titleFont='Impact, "Arial Narrow", sans-serif';
export const chineseFont='"Microsoft YaHei", "PingFang SC", sans-serif';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

export const Reveal=({children,delay=14,style={}}:{children?:React.ReactNode;delay?:number;style?:React.CSSProperties})=>{
  const frame=useCurrentFrame();
  return <div style={{...style,opacity:interpolate(frame,[delay,delay+22],[0,1],clamp),translate:`0 ${interpolate(frame,[delay,delay+28],[30,0],{...clamp,easing:Easing.out(Easing.cubic)})}px`}}>{children}</div>;
};
export const Eyebrow=({children}:{children:React.ReactNode})=><div style={{fontFamily:'Arial',fontSize:20,color:colors.gold,letterSpacing:5,lineHeight:1.5,display:'flex',alignItems:'center',gap:20}}><i style={{height:7,width:7,background:colors.gold,rotate:'45deg',display:'inline-block'}}/>{children}</div>;
export const ChineseTitle=({children}:{children:React.ReactNode})=><div style={{fontSize:56,letterSpacing:6,fontWeight:400,lineHeight:1.55,marginTop:30}}>{children}</div>;
export const Metric=({value,unit,label,size=124}:{value:string;unit:string;label:string;size?:number})=><div><div style={{display:'flex',alignItems:'baseline',gap:16}}><span style={{fontFamily:titleFont,fontSize:size,lineHeight:1,letterSpacing:1}}>{value}</span><span style={{fontSize:27,fontFamily:'Georgia',color:colors.gold}}>{unit}</span></div><div style={{fontSize:23,color:colors.muted,letterSpacing:4,marginTop:16}}>{label}</div></div>;
export const Chapter=({index,children,side='left'}:{index:number;children:React.ReactNode;side?:'left'|'right'|'none'})=>{
  const frame=useCurrentFrame();const {fps,id}=useVideoConfig();const duration=Math.round(scenes[index].duration*fps);
  return <>{id!=='ChiefFilm'&&<AbsoluteFill className="film" style={{background:colors.black}}><Stage frameOverride={Math.round(scenes[index].start*fps)+frame}/><Brand/></AbsoluteFill>}<AbsoluteFill style={{color:colors.ivory,fontFamily:chineseFont,opacity:interpolate(frame,[0,8,duration-12,duration-1],[0,1,1,0],clamp)}}>
    {side!=='none'&&<AbsoluteFill style={{background:side==='left'?'linear-gradient(90deg, #111110 0%, #111110f5 24%, #11111080 36%, transparent 52%)':'linear-gradient(270deg, #111110 0%, #111110f5 33%, #11111055 43%, transparent 56%)'}}/>}
    {children}
  </AbsoluteFill></>;
};
export const Brand=()=> <div style={{position:'absolute',left:120,top:60,color:colors.ivory}}><div style={{font:'bold italic 41px Georgia',letterSpacing:-2}}>Indian</div><div style={{font:'10px Arial',letterSpacing:4,marginTop:8}}>MOTORCYCLE</div></div>;
