import {BasicCaptions} from '../basic-captions';
import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric, colors} from '../design';
export const Edition = () => <Chapter index={4} side="right">
  <div style={{position:'absolute',left:1240,top:210,width:550}}>
    <Reveal><Eyebrow>STURGIS, SD EDITION</Eyebrow><ChineseTitle>为相聚，<br/>留下印记。</ChineseTitle></Reveal>
    <Reveal delay={35} style={{marginTop:30}}><Metric value="125" unit="台" label="全球限量" size={210}/></Reveal>
    <Reveal delay={55} style={{marginTop:40,fontSize:26,letterSpacing:3,lineHeight:1.8,color:colors.muted}}>彩色酋长徽标<br/>56 号侧盖图形</Reveal>
  </div>
{/* captions:start */}
  <div className="film-captions" style={{position:"absolute",left:240,bottom:85,width:1440,height:70}}><BasicCaptions name="中文字幕" width={1440} combineTokensWithinMilliseconds={0} premountFor={30} captions={[
  {
    "text": "Sturgis 特别版，",
    "startMs": 320,
    "endMs": 3490,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "全球限量 125 台。",
    "startMs": 3490,
    "endMs": 4945,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "56 号图形，留下专属印记。",
    "startMs": 5075,
    "endMs": 8550,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]}/></div>
  {/* captions:end */}
</Chapter>;
