"""Create Ride After Dark, an original 48-second instrumental motorcycle score.

Offline and deterministic: NumPy + FFmpeg only. No voices, sampled recordings,
API calls, or copied melodies. 120 BPM, 24 bars, six eight-second film chapters.
Run from any directory: python video/audio-tools/create_music_only.py
"""
from __future__ import annotations

import json
from pathlib import Path
import shutil
import subprocess

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "public" / "audio"
TMP = ROOT / "audio-tools" / "tmp" / "music-only"
DELIVERABLES = ROOT.parents[1] / "deliverables"
SR = 48_000
SECONDS = 48
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
N = SR * SECONDS
RNG = np.random.default_rng(20261015)


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def timeline(duration: float) -> np.ndarray:
    return np.arange(round(SR * duration), dtype=np.float64) / SR


def band(signal: np.ndarray, low: float = 0, high: float = 18_000) -> np.ndarray:
    """Smooth, zero-phase spectral filter; all musical envelopes follow filtering."""
    length = len(signal)
    frequencies = np.fft.rfftfreq(length, 1 / SR)
    response = 1 / np.sqrt(1 + (frequencies / high) ** 8)
    if low:
        response *= 1 / np.sqrt(1 + (low / np.maximum(frequencies, .01)) ** 8)
    if signal.ndim == 2:
        response = response[:, None]
    return np.fft.irfft(np.fft.rfft(signal, axis=0) * response, n=length, axis=0)


def noise(duration: float, low: float, high: float) -> np.ndarray:
    return band(RNG.normal(0, 1, round(SR * duration)), low, high)


def gate(t: np.ndarray, duration: float, attack: float = .008, release: float = .06) -> np.ndarray:
    return np.clip(t / attack, 0, 1) * np.clip((duration - t) / release, 0, 1)


def add(bus: np.ndarray, audio: np.ndarray, seconds: float, gain: float = 1, pan: float = 0):
    start = round(seconds * SR)
    first = max(0, -start)
    start = max(0, start)
    count = min(len(audio) - first, len(bus) - start)
    if count <= 0:
        return
    audio = audio[first:first + count]
    if audio.ndim == 1:
        angle = (np.clip(pan, -1, 1) + 1) * np.pi / 4
        audio = audio[:, None] * np.array([np.cos(angle), np.sin(angle)])
    bus[start:start + count] += gain * audio


def kick() -> np.ndarray:
    t = timeline(.65)
    phase = 2 * np.pi * (48 * t + 108 * (1 - np.exp(-48 * t)) / 48 + 30 * (1 - np.exp(-11 * t)) / 11)
    body = np.sin(phase) * (1 - np.exp(-1900 * t)) * np.exp(-8.5 * t)
    punch = np.sin(2 * np.pi * 145 * t) * np.exp(-55 * t) * .22
    click = noise(.65, 1700, 9000) * np.exp(-330 * t) * .28
    return np.tanh((body + punch + click) * 1.8) * gate(t, .65, .0005, .03)


def snare() -> np.ndarray:
    t = timeline(.56)
    body = (.65 * np.sin(2 * np.pi * 184 * t + .12 * np.exp(-35 * t)) * np.exp(-20 * t)
            + .28 * np.sin(2 * np.pi * 326 * t) * np.exp(-27 * t))
    wires = noise(.56, 1100, 12_000) * np.exp(-14 * t) * .74
    snap = noise(.56, 3700, 12_000) * np.exp(-120 * t) * .24
    clap = np.zeros_like(t)
    for delay, amount in [(0, .18), (.009, .15), (.018, .12), (.029, .09)]:
        shifted = np.maximum(0, t - delay)
        clap += noise(.56, 900, 5500) * np.exp(-45 * shifted) * (t >= delay) * amount
    return np.tanh((body + wires + clap + snap) * 1.45) * gate(t, .56, .0007, .04)


def hat(opened: bool = False) -> np.ndarray:
    duration = .34 if opened else .10
    t = timeline(duration)
    metal = sum(np.sin(2 * np.pi * f * t + i) * np.sin(2 * np.pi * f * 1.621 * t)
                for i, f in enumerate([1723, 2297, 2917, 3511, 4339, 5261])) / 3
    raw = band(metal, 5700, 15_000) * .45 + noise(duration, 6200, 15_000) * .65
    return raw * np.exp(-t * (12 if opened else 46)) * gate(t, duration, .0005, .025)


def cymbal() -> np.ndarray:
    t = timeline(2.15)
    metal = sum(np.sin(2 * np.pi * f * t + i) * np.sin(2 * np.pi * f * 1.4142 * t)
                for i, f in enumerate([1177, 1609, 2311, 2791, 3517, 4391, 6311])) / 4
    return (band(metal, 2800, 15_000) * .36 + noise(2.15, 3500, 14_500) * .78) * np.exp(-2.6 * t) * gate(t, 2.15, .0015, .14)


def tom(note: int) -> np.ndarray:
    t = timeline(.45)
    frequency = hz(note)
    phase = 2 * np.pi * (frequency * t + frequency * .17 * (1 - np.exp(-28 * t)) / 28)
    sound = np.sin(phase) * np.exp(-11 * t) + .16 * noise(.45, 400, 4500) * np.exp(-55 * t)
    return np.tanh(sound * 1.7) * gate(t, .45, .001, .03)


def bass(note: int, duration: float, brightness: float = 1) -> np.ndarray:
    t = timeline(duration)
    f = hz(note)
    fundamental = np.sin(2 * np.pi * f * t)
    body = fundamental + .35 * np.sin(2 * np.pi * f * 2 * t + .2)
    for harmonic in range(3, 11):
        body += .29 * brightness * np.sin(2 * np.pi * f * harmonic * t + .13 * harmonic) / harmonic
    body = np.tanh(body * 1.55) / 1.4
    return body * gate(t, duration, .005, min(.06, duration * .32)) * (.82 + .18 * np.exp(-12 * t))


def riff(note: int, duration: float, amount: float = 1) -> np.ndarray:
    """Palm-muted electric power-chord timbre, detuned stereo string harmonics."""
    t = timeline(duration)
    result = np.zeros((len(t), 2))
    for side, detune in enumerate([-.0028, .0028]):
        for interval, volume in [(0, 1), (7, .53), (12, .3)]:
            f = hz(note + interval) * (1 + detune)
            tone = np.zeros_like(t)
            for harmonic in range(1, 23):
                tone += np.sin(2 * np.pi * f * harmonic * t + .13 * harmonic) / harmonic ** .9 * np.exp(-t * (1.8 + harmonic * .65))
            result[:, side] += tone * volume
    saturation = np.tanh(result * 2.6)
    saturation = band(saturation, 130, 4400)
    pick = noise(duration, 1500, 5000) * np.exp(-90 * t) * .1
    saturation += pick[:, None]
    envelope = gate(t, duration, .003, min(duration * .35, .10)) * np.exp(-t * 1.6)
    return saturation * envelope[:, None] * amount


def synth(note: int, duration: float, bright: float = 1, soft: bool = False) -> np.ndarray:
    t = timeline(duration)
    result = np.zeros((len(t), 2))
    f = hz(note)
    for side, detune in enumerate([-.0018, .0018]):
        vibrato = .0023 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / .12, 0, 1)
        phase = 2 * np.pi * f * (t * (1 + detune) + vibrato / (2 * np.pi * 5.2))
        for harmonic in range(1, 12 if soft else 16):
            weight = np.exp(-harmonic / (3.2 if soft else 5.0)) / harmonic
            result[:, side] += np.sin(phase * harmonic + harmonic * .25) * weight
    result = np.tanh(result * (1.35 if soft else 1.9))
    envelope = gate(t, duration, .024 if soft else .008, min(duration * .42, .18))
    envelope *= .73 + .27 * np.exp(-t * 9)
    return result * envelope[:, None] * bright


def chord(notes: list[int], duration: float) -> np.ndarray:
    t = timeline(duration)
    result = sum(synth(n, duration, soft=True) for n in notes) / len(notes)
    return result * gate(t, duration, .22, .32)[:, None]


def echoes(audio: np.ndarray, taps: list[tuple[float, float]], cross: bool = False) -> np.ndarray:
    result = np.zeros_like(audio)
    for delay, gain in taps:
        samples = round(delay * SR)
        source = audio[:, ::-1] if cross else audio
        result[samples:] += source[:-samples] * gain
    return result


def write_float(path: Path, audio: np.ndarray):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "pipe:0", "-c:a", "pcm_f32le", str(path)],
                   input=audio.astype("<f4").tobytes(), check=True)


def measure(path: Path) -> dict:
    run = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "loudnorm=I=-13:TP=-1.6:LRA=8:print_format=json", "-f", "null", "-"], capture_output=True, text=True, check=True)
    return json.JSONDecoder().raw_decode(run.stderr[run.stderr.rfind("{"):])[0]


def main():
    AUDIO.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    DELIVERABLES.mkdir(parents=True, exist_ok=True)
    buses = {name: np.zeros((N, 2)) for name in ["drums", "bass", "guitar", "lead", "arp", "pad", "fx"]}
    drums, bass_bus, guitars, lead, arp, pads, fx = [buses[n] for n in ["drums", "bass", "guitar", "lead", "arp", "pad", "fx"]]
    drum_kick, drum_snare, closed_hat, open_hat, crash = kick(), snare(), hat(), hat(True), cymbal()
    kick_times = []
    roots = [40, 36, 43, 38]  # E2 C2 G2 D2, one harmonic cycle per eight-second scene.
    sections = ["Ignition", "Night drive", "Chrome and leather", "Low and long", "Full throttle", "Ride after dark"]

    for bar in range(24):
        section, local_bar = divmod(bar, 4)
        start = bar * BAR
        root = roots[local_bar]
        if bar == 23:
            root = 40  # Resolve to E minor instead of cutting off the loop.
        chord_notes = {40: [52, 55, 59, 64], 36: [48, 52, 55, 60], 43: [50, 55, 59, 62], 38: [50, 54, 57, 62]}[root]
        density = [0.60, .95, .82, .72, 1.0, .95][section]

        # A final downbeat with a two-second ring-out gives the film a real ending.
        if bar == 23:
            add(drums, drum_kick, start, .96)
            kick_times.append(start)
            add(drums, crash, start, .52, -.10)
            add(bass_bus, bass(28, 1.9), start, .34)
            add(guitars, riff(40, 1.82), start, .28)
            add(pads, chord(chord_notes, 1.92), start, .22)
            add(lead, synth(76, 1.8), start, .18)
            continue

        # Downbeats follow the six 8 s scene cuts. Intro and bridge leave space.
        kick_beats = [0, 1, 2, 3]
        if section == 0 and local_bar < 2:
            kick_beats = [0, 2]
        elif section == 3 and local_bar < 2:
            kick_beats = [0, 1.5, 2.5]
        for beat in kick_beats:
            add(drums, drum_kick, start + beat * BEAT, .87 if beat % 1 == 0 else .7)
            kick_times.append(start + beat * BEAT)
        if section not in [0] or local_bar >= 2:
            snare_beats = [1, 3] if not (section == 3 and local_bar == 0) else [2]
            for beat in snare_beats:
                add(drums, drum_snare, start + beat * BEAT, .60, -.025)
        for tick in range(8):
            if section == 0 and local_bar == 0 and tick < 4:
                continue
            add(drums, closed_hat, start + tick * BEAT / 2, (.17 if tick % 2 == 0 else .22) * (.72 if section == 0 else 1), (-1 if tick % 2 else 1) * .27)
            if tick % 2 == 1 and section in [1, 2, 4, 5]:
                add(drums, open_hat, start + tick * BEAT / 2, .13, .24)
        if section in [2, 4] or (section == 3 and local_bar > 1):
            for tick in [3, 7, 11, 15]:
                add(drums, closed_hat, start + tick * BEAT / 4, .085, -.3)
        if local_bar == 0:
            add(drums, crash, start, .38 if section == 0 else .48, -.18)

        # Muscular syncopated bass and short overdriven power chords.
        for index, beat in enumerate([0, .5, 1, 1.5, 2, 2.75, 3, 3.5]):
            offset = [0, 0, 12, 0, 0, 7, 0, 7][index]
            if section == 0 and local_bar == 0 and index not in [0, 4, 6]:
                continue
            duration = (.40 if index == 7 else .30) * BEAT
            add(bass_bus, bass(root - 12 + (12 if index == 2 else 0), duration + .05), start + beat * BEAT, .36 * density)
            if not (section == 3 and local_bar == 0):
                add(guitars, riff(root + (0 if offset == 12 else offset), duration + .06), start + beat * BEAT, .22 * density)

        add(pads, chord(chord_notes, BAR + .23), start, .12 if section == 3 else .085)
        # Wide, repeating eighth-note arpeggios connect close-up shots.
        arp_notes = [chord_notes[i] + 12 for i in [0, 2, 1, 3, 2, 1, 3, 2]]
        for step, note in enumerate(arp_notes):
            volume = .067 if section in [0, 2, 3] else .042
            add(arp, synth(note, .28, soft=True), start + step * BEAT / 2, volume, 0)

        # Original call-and-response melody. It first appears at 16 s, then
        # returns in a higher-energy register for the 32 s hero reveal.
        if section in [2, 4, 5]:
            melodies = [
                [(0, 76, .65), (1.5, 74, .35), (2.5, 71, .4), (3.5, 74, .4)],
                [(0, 76, .8), (2, 79, .55), (3.5, 76, .4)],
                [(0, 74, .65), (1.5, 71, .4), (2.5, 67, .55)],
                [(0, 69, .65), (1.5, 71, .4), (2.5, 74, .7)],
            ]
            for beat, note, duration in melodies[local_bar]:
                add(lead, synth(note, duration, .9), start + beat * BEAT, .16 if section == 4 else .13)

        if local_bar == 3 and bar < 22:
            # Compact descending tom fill, plus a snare pickup at the scene cut.
            for beat, note, pan in [(2.75, 53, -.35), (3.25, 48, .0), (3.5, 43, .3), (3.75, 41, .38)]:
                add(drums, tom(note), start + beat * BEAT, .3, pan)
            add(drums, drum_snare, start + 3.875 * BEAT, .22, .08)
        if section == 3 and local_bar in [2, 3]:
            for beat in np.arange(2, 4, .25 if local_bar == 3 else .5):
                add(drums, drum_snare, start + float(beat) * BEAT, .1 + .11 * float(beat) / 4, -.05)

    # Film transitions: filtered reverse cymbals and octave-falling sub impacts.
    for cut in [8, 16, 24, 32, 40]:
        t = timeline(1.2)
        rise = noise(1.2, 900, 11_000) * (t / 1.2) ** 2.7 * gate(t, 1.2, .12, .01)
        add(fx, rise, cut - 1.2, .16, -.25)
        add(fx, rise, cut - 1.16, .1, .4)
        t = timeline(.8)
        drop = np.sin(2 * np.pi * (38 * t + 35 * (1 - np.exp(-8 * t)) / 8)) * np.exp(-5 * t) * gate(t, .8, .005, .08)
        add(fx, drop, cut, .16)

    # Short room on snare/drums; eighth/dotted-eighth stereo echoes on melody.
    room = echoes(band(drums, 700, 7000), [(.037, .055), (.059, .043), (.083, .031), (.113, .024), (.151, .016)], cross=True)
    lead += echoes(band(lead, 450, 6500), [(.375, .24), (.75, .12), (1.125, .055)], cross=True)
    arp += echoes(band(arp, 700, 6500), [(.25, .22), (.5, .12)], cross=True)
    guitars += echoes(band(guitars, 450, 4200), [(.029, .075), (.047, .045)], cross=True)

    # A deterministic kick side-chain creates punch without squeezing the drums.
    duck = np.ones(N)
    for seconds in kick_times:
        start = round(seconds * SR)
        t = timeline(.19)
        count = min(len(t), N - start)
        duck[start:start + count] = np.minimum(duck[start:start + count], 1 - .44 * np.exp(-t[:count] / .055))
    music = drums + room + bass_bus * duck[:, None] + guitars * duck[:, None] + lead + arp + pads * duck[:, None] + fx
    music = band(music, 28, 17_500)
    music *= gate(timeline(SECONDS), SECONDS, .006, .30)[:, None]
    music *= .89 / np.max(np.abs(music))
    raw = TMP / "ride-after-dark-mix.wav"
    premaster = TMP / "ride-after-dark-premaster.wav"
    write_float(raw, music)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "acompressor=threshold=0.28:ratio=1.65:attack=18:release=110:makeup=1:link=average:detection=rms", "-c:a", "pcm_f32le", str(premaster)], check=True)
    measured = measure(premaster)
    normalization = ("loudnorm=I=-13:TP=-1.6:LRA=8:linear=true:"
                     f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
                     f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
                     f"offset={measured['target_offset']}")
    wav = AUDIO / "ride-after-dark.wav"
    mp3 = AUDIO / "ride-after-dark.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(premaster), "-af", normalization, "-ar", str(SR), "-c:a", "pcm_s24le", "-t", str(SECONDS), str(wav)], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "320k", "-ar", str(SR), "-metadata", "title=Ride After Dark", "-metadata", "artist=Chief Vintage Film Project", str(mp3)], check=True)
    final_metrics = measure(wav)
    mp3_metrics = measure(mp3)
    metadata = {
        "title": "Ride After Dark",
        "style": "Original dark synthwave / electronic rock instrumental",
        "durationSeconds": SECONDS,
        "bpm": BPM,
        "meter": "4/4",
        "bars": 24,
        "key": "E minor",
        "sampleRate": SR,
        "channels": 2,
        "wavBitDepth": 24,
        "mp3Bitrate": 320000,
        "containsSpeech": False,
        "containsEngineRecordings": False,
        "provenance": "Original notes and procedural synthesis. No third-party music, samples, or voices. Created locally without an API.",
        "generator": "audio-tools/create_music_only.py",
        "seed": 20261015,
        "sectionCues": [{"start": i * 8, "duration": 8, "name": name} for i, name in enumerate(sections)],
        "arrangement": ["Deep kick and layered snare", "Stereo hats and crashes", "Syncopated mono-compatible sub bass", "Detuned overdriven power chords", "Stereo analog lead and arpeggios", "Scene-cut risers, drum fills, final tonic ring-out"],
        "wavMeasurement": {"integratedLUFS": float(final_metrics["input_i"]), "truePeakDBTP": float(final_metrics["input_tp"]), "loudnessRangeLU": float(final_metrics["input_lra"])},
        "mp3Measurement": {"integratedLUFS": float(mp3_metrics["input_i"]), "truePeakDBTP": float(mp3_metrics["input_tp"]), "loudnessRangeLU": float(mp3_metrics["input_lra"])},
        "qualityChecks": "Measured with FFmpeg loudnorm. Synthesis and arrangement inspected in source; no claim of human listening.",
    }
    (AUDIO / "music-only-metadata.json").write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    shutil.copy2(mp3, DELIVERABLES / "Chief_Vintage_Ride_After_Dark.mp3")
    print(json.dumps({"wav": str(wav), "mp3": str(mp3), "deliverable": str(DELIVERABLES / "Chief_Vintage_Ride_After_Dark.mp3"), "measurements": metadata["wavMeasurement"], "mp3Measurements": metadata["mp3Measurement"]}, indent=2))


if __name__ == "__main__":
    main()
