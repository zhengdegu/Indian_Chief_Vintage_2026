import {BasicCaptions} from '../basic-captions';
import React from 'react';
import {Chapter, ChineseTitle, Eyebrow, Reveal, Metric} from '../design';
export const Chassis = () => <Chapter index={3} side="none">
  <Reveal style={{position:'absolute',left:120,top:180}}><Eyebrow>LOW. LONG. COMPOSED.</Eyebrow><ChineseTitle>从容，自成姿态。</ChineseTitle></Reveal>
  <Reveal delay={35} style={{position:'absolute',right:120,top:180,display:'flex',gap:65}}><Metric value="1,626" unit="mm" label="轴距" size={100}/><Metric value="686" unit="mm" label="座高" size={100}/></Reveal>
  <Reveal delay={50} style={{position:'absolute',left:350,right:280,bottom:205,height:1,background:'linear-gradient(90deg,transparent,#bda37b66 15%,#bda37b66 85%,transparent)'}}/>
{/* captions:start */}
  <div className="film-captions" style={{position:"absolute",left:240,bottom:85,width:1440,height:70}}><BasicCaptions name="中文字幕" width={1440} combineTokensWithinMilliseconds={0} premountFor={30} captions={[
  {
    "text": "1,626 mm 轴距 · 686 mm 座高",
    "startMs": 320,
    "endMs": 5285,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": "低伏姿态，从容延展。",
    "startMs": 5415,
    "endMs": 8010,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]}/></div>
  {/* captions:end */}
</Chapter>;
