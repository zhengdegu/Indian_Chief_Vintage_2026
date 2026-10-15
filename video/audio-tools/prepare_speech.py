"""Prepare temporary JSONL jobs for the installed Speech skill CLI. No API calls."""
from pathlib import Path
import json
import re
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--regenerate', action='store_true', help='Include all clips even when files already exist.')
args = parser.parse_args()
manifest = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
instructions = (ROOT / 'audio-tools/voice-instructions.txt').read_text(encoding='utf-8').strip()
jobs = []
for index, scene in enumerate(manifest['scenes'], start=1):
    texts = re.findall(r'[^。！？]+[。！？]?', scene['narration'])
    scene['spokenSegments'] = []
    for part, spoken in enumerate(texts):
        name = f'{index:02d}{chr(97 + part)}.wav'
        scene['spokenSegments'].append({'text': spoken, 'file': f'audio/segments/{name}', 'subtitle': scene['subtitleLines'][part]})
        if args.regenerate or not (ROOT / 'public/audio/segments' / name).exists():
            jobs.append({'input': spoken, 'model': 'gpt-4o-mini-tts-2025-12-15', 'voice': 'cedar', 'instructions': instructions, 'response_format': 'wav', 'out': name})
manifest['tts'] = {'model': 'gpt-4o-mini-tts-2025-12-15', 'voice': 'cedar', 'speed': 1.0, 'instructions': instructions, 'format': 'wav', 'provider': 'OpenAI', 'generated': False}
(ROOT / 'content.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
job_path = ROOT / 'audio-tools/tmp/speech/jobs.jsonl'
job_path.parent.mkdir(parents=True, exist_ok=True)
job_path.write_text('\n'.join(json.dumps(job, ensure_ascii=False) for job in jobs) + '\n', encoding='utf-8')
print(f'Prepared {len(jobs)} jobs in {job_path}')
