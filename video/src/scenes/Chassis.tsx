import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric} from '../design';
export const Chassis = () => <Chapter index={3} side="none">
  <Reveal style={{position:'absolute',left:120,top:180}}><Eyebrow>LOW. LONG. COMPOSED.</Eyebrow><ChineseTitle>从容，自成姿态。</ChineseTitle></Reveal>
  <Reveal delay={35} style={{position:'absolute',right:120,top:180,display:'flex',gap:65}}><Metric value="1,626" unit="mm" label="轴距" size={100}/><Metric value="686" unit="mm" label="座高" size={100}/></Reveal>
  <Reveal delay={50} style={{position:'absolute',left:350,right:280,bottom:205,height:1,background:'linear-gradient(90deg,transparent,#bda37b66 15%,#bda37b66 85%,transparent)'}}/>
</Chapter>;
