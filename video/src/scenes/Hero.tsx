import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, colors, titleFont} from '../design';
export const Hero = () => <Chapter index={0} side="none">
  <Reveal delay={10} style={{position:'absolute',left:120,top:175}}><Eyebrow>2026 COLLECTION / STURGIS, SD EDITION</Eyebrow></Reveal>
  <Reveal delay={18} style={{position:'absolute',left:110,top:210}}><div style={{fontFamily:titleFont,fontSize:260,letterSpacing:-5}}>CHIEF</div></Reveal>
  <Reveal delay={30} style={{position:'absolute',left:490,top:360}}><div style={{font:'italic 158px Georgia',letterSpacing:-10,color:colors.gold,rotate:'-6deg'}}>Vintage</div></Reveal>
  <Reveal delay={35} style={{position:'absolute',left:120,top:610}}><ChineseTitle>经典，<br/>从未停下。</ChineseTitle><div style={{marginTop:30,fontSize:23,letterSpacing:4,color:colors.muted}}>一段传奇，新的回响。</div></Reveal>
</Chapter>;
