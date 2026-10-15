import {BasicCaptions} from '../basic-captions';
import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, colors} from '../design';
export const Craft = () => <Chapter index={2} side="right">
  <div style={{position:'absolute',left:1260,top:240,width:560}}>
    <Reveal><Eyebrow>RED. CREAM. ESPRESSO.</Eyebrow><ChineseTitle>每一处，<br/>都有来历。</ChineseTitle></Reveal>
    <Reveal delay={35} style={{marginTop:55}}><div style={{display:'flex',gap:14,marginBottom:25}}><i style={{width:40,height:40,borderRadius:'50%',background:'#a3262c',border:'1px solid #ffffff55'}}/><i style={{width:40,height:40,borderRadius:'50%',background:'#e1d2b1'}}/><i style={{width:40,height:40,borderRadius:'50%',background:'#634937'}}/></div><div style={{font:'32px Georgia',color:colors.gold}}>Indian Red / Cream</div><div style={{fontSize:25,letterSpacing:4,color:colors.muted,marginTop:18}}>双色涂装 · 深裙边挡泥板</div></Reveal>
    <Reveal delay={55} style={{marginTop:45,paddingTop:32,borderTop:'1px solid #bda37b44'}}><div style={{font:'italic 45px Georgia'}}>Espresso</div><div style={{fontSize:25,letterSpacing:4,color:colors.muted,marginTop:16}}>浓咖啡色皮革独立座椅</div></Reveal>
  </div>
{/* captions:start */}
  <div className="film-captions" style={{position:"absolute",left:240,bottom:85,width:1440,height:70}}><BasicCaptions name="中文字幕" width={1440} combineTokensWithinMilliseconds={0} premountFor={30} captions={[
  {
    "text": "印第安红，遇见奶油白。",
    "startMs": 320,
    "endMs": 3155,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "深裙边挡泥板与浓咖啡色独立座椅，",
    "startMs": 3285,
    "endMs": 7285,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "勾勒经典轮廓。",
    "startMs": 7285,
    "endMs": 9080,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]}/></div>
  {/* captions:end */}
</Chapter>;
