import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric, colors} from '../design';
export const Engine = () => <Chapter index={1}>
  <div style={{position:'absolute',left:120,top:230,width:550}}>
    <Reveal><Eyebrow>THUNDERSTROKE 116</Eyebrow><ChineseTitle>看得见的<br/>力量。</ChineseTitle></Reveal>
    <Reveal delay={35} style={{marginTop:50}}><Metric value="1,890" unit="cc" label="发动机排量" size={152}/></Reveal>
    <Reveal delay={49} style={{marginTop:40,paddingTop:30,borderTop:'1px solid #bda37b55',display:'flex',gap:70}}><Metric value="156" unit="N·m" label="最大扭矩" size={84}/><Metric value="49" unit="°" label="V 型双缸" size={84}/></Reveal>
  </div>
</Chapter>;
