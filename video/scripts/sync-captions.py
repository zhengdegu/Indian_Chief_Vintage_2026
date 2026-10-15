"""Write measured caption timings as editable JSX literals in each scene."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
content = json.loads((root / 'content.json').read_text(encoding='utf-8'))
root_path = root / 'src' / 'Root.tsx'
registration = root_path.read_text(encoding='utf-8')
for scene in content['scenes']:
    path = root / 'src' / 'scenes' / (scene['id'].capitalize() + '.tsx')
    source = path.read_text(encoding='utf-8')
    if content.get('variant') == 'music-only':
        source = re.sub(r'\{/\* captions:start \*/\}.*?\{/\* captions:end \*/\}\s*', '', source, flags=re.S)
        source = re.sub(r"^import \{BasicCaptions\} from '../basic-captions';\r?\n", '', source, flags=re.M)
    elif "from '../basic-captions'" not in source:
        source = "import {BasicCaptions} from '../basic-captions';\n" + source
    captions = []
    for cue in scene['subtitleCues']:
        captions.append(dict(text=cue['text'], startMs=round((cue['start']-scene['start'])*1000), endMs=round((cue['end']-scene['start'])*1000), timestampMs=None, confidence=None, pageBreakAfter=True))
    markup = '{/* captions:start */}\n  <div className="film-captions" style={{position:"absolute",left:240,bottom:85,width:1440,height:70}}><BasicCaptions name="中文字幕" width={1440} combineTokensWithinMilliseconds={0} premountFor={30} captions={' + json.dumps(captions, ensure_ascii=False, indent=2) + '}/></div>\n  {/* captions:end */}'
    if content.get('variant') == 'music-only':
        pass
    elif '{/* captions:start */}' in source:
        source = re.sub(r'\{/\* captions:start \*/\}.*?\{/\* captions:end \*/\}', lambda _: markup, source, flags=re.S)
    else:
        source = source.replace('</Chapter>', markup + '\n</Chapter>')
    path.write_text(source, encoding='utf-8')
    pattern = r'(id="' + scene['id'].capitalize() + r'"[^\n]*?durationInFrames=\{)\d+(\})'
    registration = re.sub(pattern, lambda m: m[1] + str(scene['durationFrames']) + m[2], registration)
root_path.write_text(registration, encoding='utf-8')
print('Updated scene captions and standalone durations for ' + content.get('variant', 'narrated') + '.')
