"""Assemble measured speech clips, accurate subtitle cues and an original synth score.

This script is entirely offline. It never reads credentials or calls an API.
"""
from pathlib import Path
import json
import math
import re
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / 'public/audio'
SR = 48000
FPS = 30


def read_wave(path):
    with wave.open(str(path), 'rb') as wav:
        assert wav.getsampwidth() == 2, 'Expected 16-bit PCM speech'
        sr = wav.getframerate()
        data = np.frombuffer(wav.readframes(wav.getnframes()), dtype='<i2').astype(np.float64) / 32768
        if wav.getnchannels() > 1:
            data = data.reshape(-1, wav.getnchannels()).mean(axis=1)
    if sr != SR:
        data = np.interp(np.arange(round(len(data) * SR / sr)) / SR, np.arange(len(data)) / sr, data)
    return data


def write_wave(path, data):
    pcm = np.clip(data, -0.999, 0.999)
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(1 if data.ndim == 1 else data.shape[1])
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(np.round(pcm * 32767).astype('<i2').tobytes())


def trim_quiet(data):
    # Conservative short-window detection retains initial consonants and word tails.
    window = SR // 100
    usable = len(data) // window * window
    rms = np.sqrt(np.mean(data[:usable].reshape(-1, window) ** 2, axis=1))
    active = np.flatnonzero(rms > 0.0012)
    if not len(active):
        raise ValueError('Generated clip is silent')
    first = max(0, int(active[0] * window - 0.075 * SR))
    last = min(len(data), int((active[-1] + 1) * window + 0.15 * SR))
    return data[first:last], first / SR


def format_srt(seconds):
    millis = round(seconds * 1000)
    h, rem = divmod(millis, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'


def moving_average(data, window):
    padded = np.pad(data, (window // 2, window - window // 2 - 1), mode='edge')
    sums = np.concatenate([[0.0], np.cumsum(padded, dtype=np.float64)])
    return (sums[window:] - sums[:-window]) / window


def caption_parts(text, audio, offset):
    """Split a long comma-delimited caption at its nearest measured quiet break."""
    if len(text) <= 22 or '，' not in text:
        return [{'text': text, 'start': offset, 'end': offset + len(audio) / SR}]
    split = text.rfind('，') + 1
    first, second = text[:split], text[split:]
    if not first or not second:
        return [{'text': text, 'start': offset, 'end': offset + len(audio) / SR}]
    target = len(audio) * len(re.sub(r'\W', '', first)) / len(re.sub(r'\W', '', text))
    window = SR // 100
    rms = np.sqrt(np.mean(audio[:len(audio) // window * window].reshape(-1, window) ** 2, axis=1))
    silent = np.flatnonzero(rms < 0.0012) * window
    candidates = silent[(silent > target - SR * .7) & (silent < target + SR * .7)]
    boundary = int(candidates[np.argmin(abs(candidates - target))]) if len(candidates) else round(target)
    seconds = boundary / SR
    return [{'text': first, 'start': offset, 'end': offset + seconds}, {'text': second, 'start': offset + seconds, 'end': offset + len(audio) / SR}]


def measure(path):
    completed = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-af', 'loudnorm=I=-17:TP=-1.5:LRA=9:print_format=json', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    raw = completed.stderr[completed.stderr.rfind('{'):]
    return json.JSONDecoder().raw_decode(raw)[0]


def main():
    manifest = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
    cursor = 0
    cues = []
    speech_arrays = []
    minimum_seconds = [6.0, 8.0, 8.0, 7.0, 7.0, 5.0]
    for index, scene in enumerate(manifest['scenes']):
        parts = []
        local_cues = []
        offset = 0
        for part_index, segment in enumerate(scene['spokenSegments']):
            raw = read_wave(ROOT / 'public' / segment['file'])
            clip, trimmed = trim_quiet(raw)
            segment['rawDuration'] = round(len(raw) / SR, 6)
            segment['trimmedLeadingSeconds'] = round(trimmed, 6)
            segment['duration'] = round(len(clip) / SR, 6)
            local_cues.extend(caption_parts(segment['subtitle'], clip, offset / SR))
            parts.append(clip)
            offset += len(clip)
            if part_index < len(scene['spokenSegments']) - 1:
                gap = np.zeros(round(0.13 * SR))
                parts.append(gap)
                offset += len(gap)
        combined = np.concatenate(parts)
        leading = 0.65 if index == 0 else 0.32
        trailing = 1.2 if index == len(manifest['scenes']) - 1 else 0.45
        duration_frames = math.ceil(max(minimum_seconds[index], leading + len(combined) / SR + trailing) * FPS)
        scene['startFrame'] = cursor
        scene['durationFrames'] = duration_frames
        scene['start'] = cursor / FPS
        scene['duration'] = duration_frames / FPS
        scene['audioDuration'] = len(combined) / SR
        scene['speechOffset'] = leading
        scene['speechStart'] = scene['start'] + leading
        scene['subtitleCues'] = []
        for cue in local_cues:
            cue['start'] = round(cue['start'] + scene['speechStart'], 6)
            cue['end'] = round(cue['end'] + scene['speechStart'], 6)
            cue['sceneId'] = scene['id']
            scene['subtitleCues'].append(cue)
            cues.append(cue)
        speech_arrays.append((scene, combined))
        cursor += duration_frames

    duration = cursor / FPS
    narration = np.zeros(round(duration * SR))
    for scene, combined in speech_arrays:
        start = round(scene['speechStart'] * SR)
        narration[start:start + len(combined)] += combined
    write_wave(AUDIO / 'narration-raw.wav', narration)
    raw_metrics = measure(AUDIO / 'narration-raw.wav')
    gain = 10 ** ((-17.0 - float(raw_metrics['input_i'])) / 20)
    peak_limit_gain = 10 ** ((-1.5 - float(raw_metrics['input_tp'])) / 20)
    gain = min(gain, peak_limit_gain)
    narration *= gain
    for scene, combined in speech_arrays:
        write_wave(ROOT / 'public' / scene['audio'], combined * gain)
    write_wave(AUDIO / 'narration.wav', narration)
    (AUDIO / 'narration-raw.wav').unlink()

    # Original notes and synthesis: no sampled or licensed music, no engine effects.
    length = len(narration)
    time = np.arange(length) / SR
    music = np.zeros((length, 2))
    chord_notes = [
        [146.832, 174.614, 220.0, 329.628],
        [116.541, 146.832, 174.614, 261.626],
        [130.813, 174.614, 220.0, 293.665],
        [130.813, 164.814, 195.998, 293.665],
        [146.832, 174.614, 220.0, 329.628],
        [146.832, 220.0, 293.665, 329.628],
    ]
    for index, scene in enumerate(manifest['scenes']):
        start = max(0, round((scene['start'] - 1.0) * SR))
        end = min(length, round((scene['start'] + scene['duration'] + 1.5) * SR))
        t = np.arange(end - start) / SR
        span = len(t) / SR
        envelope = np.minimum(1, t / 1.6) * np.minimum(1, (span - t) / 2.0)
        envelope = np.clip(envelope, 0, 1) ** 1.5
        for j, frequency in enumerate(chord_notes[index]):
            for channel, detune in enumerate([-0.00065, 0.00065]):
                phase = 2 * math.pi * frequency * (1 + detune) * t
                timbre = np.sin(phase) + 0.17 * np.sin(phase * 2 + 0.4) + 0.04 * np.sin(phase * 3)
                music[start:end, channel] += envelope * timbre * (0.014 / len(chord_notes[index]))
        bass = np.sin(2 * math.pi * chord_notes[index][0] / 2 * t)
        music[start:end] += (bass * envelope * 0.009)[:, None]
    # Restrained eighth-note accents form a quiet pulse below the narration.
    beat = 60 / 74 / 2
    for n, start_sec in enumerate(np.arange(1.0, duration - 2.0, beat)):
        start = round(start_sec * SR)
        end = min(length, start + round(0.8 * SR))
        t = np.arange(end - start) / SR
        frequency = [293.665, 440.0, 349.228, 440.0][n % 4]
        envelope = (1 - np.exp(-t * 140)) * np.exp(-t * 10)
        pluck = np.sin(2 * math.pi * frequency * t) * envelope * 0.007
        pan = 0.35 if n % 2 else 0.65
        music[start:end, 0] += pluck * pan
        music[start:end, 1] += pluck * (1 - pan)
    fade = np.minimum(1, time / 2.4) * np.minimum(1, (duration - time) / 2.0)
    # Sidechain-shaped ducking is based on actual voice energy, then smoothed.
    envelope = np.sqrt(np.maximum(0, moving_average(narration * narration, SR // 100)))
    duck_target = 1 - np.clip(envelope / 0.055, 0, 1) * 0.30
    duck = moving_average(duck_target, SR // 20)
    music *= (fade * duck * 4.0)[:, None]
    write_wave(AUDIO / 'music.wav', music)
    mix = narration[:, None] + music
    max_peak = np.max(np.abs(mix))
    if max_peak > 0.90:
        mix *= 0.90 / max_peak
    write_wave(AUDIO / 'soundtrack.wav', mix)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(AUDIO / 'soundtrack.wav'), '-c:a', 'libmp3lame', '-b:a', '192k', str(AUDIO / 'soundtrack.mp3')], check=True)
    srt = '\n\n'.join(f'{i}\n{format_srt(cue["start"])} --> {format_srt(cue["end"])}\n{cue["text"]}' for i, cue in enumerate(cues, start=1))
    (AUDIO / 'narration.srt').write_text(srt + '\n', encoding='utf-8')
    manifest.update({'status': 'audio-complete', 'duration': duration, 'durationInFrames': cursor, 'fps': FPS, 'subtitleCues': cues, 'soundtrack': 'audio/soundtrack.wav', 'narrationTrack': 'audio/narration.wav', 'musicTrack': 'audio/music.wav'})
    manifest['tts']['generated'] = True
    if manifest['tts']['provider'] == 'OpenAI':
        manifest['narrationDisclosure'] = '旁白由 OpenAI 语音模型生成。'
    manifest['music'] = {'type': 'original procedural synthesis', 'composer': 'Project procedural audio generation', 'description': 'Quiet cinematic synth pads and a restrained 74 BPM pulse; no engine recording or sampled commercial music.', 'duckedUnderSpeech': True}
    manifest['audioQA'] = {'narration': measure(AUDIO / 'narration.wav'), 'music': measure(AUDIO / 'music.wav'), 'soundtrack': measure(AUDIO / 'soundtrack.wav'), 'speechGain': gain, 'sampleRate': SR, 'channels': 2, 'subtitleCount': len(cues), 'allCuesMeasuredFromIndividualSpeechFiles': True, 'humanListeningPerformed': False}
    (ROOT / 'content.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'duration': duration, 'durationInFrames': cursor, 'scenes': [{'id':s['id'], 'start':s['start'], 'duration':s['duration'], 'audioDuration':s['audioDuration']} for s in manifest['scenes']], 'soundtrack': manifest['audioQA']['soundtrack']}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
