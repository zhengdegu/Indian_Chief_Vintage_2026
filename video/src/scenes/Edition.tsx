import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric, colors} from '../design';
export const Edition = () => <Chapter index={4} side="right">
  <div style={{position:'absolute',left:1240,top:210,width:550}}>
    <Reveal><Eyebrow>STURGIS, SD EDITION</Eyebrow><ChineseTitle>为相聚，<br/>留下印记。</ChineseTitle></Reveal>
    <Reveal delay={35} style={{marginTop:30}}><Metric value="125" unit="台" label="全球限量" size={210}/></Reveal>
    <Reveal delay={55} style={{marginTop:40,fontSize:26,letterSpacing:3,lineHeight:1.8,color:colors.muted}}>彩色酋长徽标<br/>56 号侧盖图形</Reveal>
  </div>
</Chapter>;
