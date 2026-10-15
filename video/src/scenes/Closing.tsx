import React from 'react';
import {content} from '../timeline';
import {Chapter, ChineseTitle, Eyebrow, Reveal, colors, titleFont} from '../design';
export const Closing = () => <Chapter index={5} side="none">
  <Reveal delay={24} style={{position:'absolute',left:120,top:190}}><Eyebrow>2026 / INDIAN MOTORCYCLE</Eyebrow><div style={{fontFamily:titleFont,fontSize:180,letterSpacing:-2,marginTop:22}}>CHIEF</div><div style={{font:'italic 110px Georgia',color:colors.gold,marginTop:-20}}>Vintage</div></Reveal>
  <Reveal delay={40} style={{position:'absolute',left:120,top:620}}><ChineseTitle>让经典，<br/>继续回响。</ChineseTitle></Reveal>
  <Reveal delay={48} style={{position:'absolute',left:120,right:120,bottom:36,display:'flex',justifyContent:'space-between',fontSize:17,color:'#8d8578',letterSpacing:1}}><span>非官方 3D 概念宣传片 · 依据公开资料重建</span><span>{content.variant==='music-only'?'MUSIC / RIDE AFTER DARK':content.narrationDisclosure}</span></Reveal>
</Chapter>;
