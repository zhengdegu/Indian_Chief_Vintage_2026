import {BasicCaptions} from '../basic-captions';
import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric, colors} from '../design';
export const Engine = () => <Chapter index={1}>
  <div style={{position:'absolute',left:120,top:230,width:550}}>
    <Reveal><Eyebrow>THUNDERSTROKE 116</Eyebrow><ChineseTitle>看得见的<br/>力量。</ChineseTitle></Reveal>
    <Reveal delay={35} style={{marginTop:50}}><Metric value="1,890" unit="cc" label="发动机排量" size={152}/></Reveal>
    <Reveal delay={49} style={{marginTop:40,paddingTop:30,borderTop:'1px solid #bda37b55',display:'flex',gap:70}}><Metric value="156" unit="N·m" label="最大扭矩" size={84}/><Metric value="49" unit="°" label="V 型双缸" size={84}/></Reveal>
  </div>
{/* captions:start */}
  <div className="film-captions" style={{position:"absolute",left:240,bottom:85,width:1440,height:70}}><BasicCaptions name="中文字幕" width={1440} combineTokensWithinMilliseconds={0} premountFor={30} captions={[
  {
    "text": "1,890 cc 排量 · 49° 风冷 V 型双缸",
    "startMs": 320,
    "endMs": 5645,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "最大扭矩，156 N·m。",
    "startMs": 5775,
    "endMs": 8790,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]}/></div>
  {/* captions:end */}
</Chapter>;
