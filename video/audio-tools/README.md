# Ride After Dark · 原创纯音乐配乐

当前默认版本为 **48 秒原创电子摇滚 / synthwave 纯音乐**，120 BPM、E minor、4/4 拍、24 小节。六组各 8 秒的音乐段落对应影片六个镜头，保留参数动效，无旁白和讲解字幕。全部声音由本地程序合成，无需 API，不含第三方音乐、采样、人声或发动机录音。

## 生成音乐

需要 Python 3.10+、NumPy，以及 PATH 中可用的 FFmpeg。在 `video` 目录运行：

```powershell
python -m pip install -r audio-tools/requirements.txt
python audio-tools/create_music_only.py
```

脚本无命令行参数，使用固定随机种子。它合成鼓组、切分贝斯、失真和弦、立体声旋律与琶音，并加入镜头边界的上升音效、鼓花和最终收束，随后用 FFmpeg 完成母带处理。输出文件：

- `public/audio/ride-after-dark.wav`：48 kHz、24 bit、立体声、48 秒，用于渲染。
- `public/audio/ride-after-dark.mp3`：320 kbps 配乐源素材。
- `public/audio/music-only-metadata.json`：编排、来源、格式、六段时间点及响度测量记录。
- `../../deliverables/Chief_Vintage_Ride_After_Dark.mp3`：独立配乐交付副本，路径相对 `video` 目录。

生成脚本会更新音乐文件和测量记录，不修改影片时间线。当前 `content.json` 已设置 `variant: "music-only"` 和 `soundtrack: "audio/ride-after-dark.wav"`。继续运行 `npm run render`，即可导出 `out/Chief_Vintage_2026_Music_1080p.mp4`。

## 时间与测量

| 镜头 | 时间范围 | 起始帧 | 帧数 |
|---|---|---:|---:|
| hero | 0–8 秒 | 0 | 240 |
| engine | 8–16 秒 | 240 | 240 |
| craft | 16–24 秒 | 480 | 240 |
| chassis | 24–32 秒 | 720 | 240 |
| edition | 32–40 秒 | 960 | 240 |
| closing | 40–48 秒 | 1200 | 240 |

全片 30 fps，共 **1440 帧**。WAV 实测 **-13.03 LUFS、-1.54 dBTP**；MP3 实测 **-13.03 LUFS、-1.33 dBTP**。测量来自 FFmpeg `loudnorm`，记录于 `public/audio/music-only-metadata.json`，不代表真人听音验收。

WAV 和临时文件不提交 Git。新克隆环境运行 `npm run assets`，可从已提供的音乐 MP3 恢复 WAV；运行生成脚本可重新得到原始 24 bit WAV。

## 可选：旧旁白工作流

旧配音稿及工具保留供制作其他版本使用，不参与默认纯音乐版。以下流程会切换为旁白版本并按实际语音长度重算镜头时间，建议在独立副本中操作。

Windows 本地中文配音需要 Microsoft Kangkang 语音。在 `video` 目录运行：

```powershell
python audio-tools/prepare_speech.py --regenerate
& ./audio-tools/generate-local.ps1
python audio-tools/build_audio.py
npm run captions
```

`build_audio.py` 会将版本切换为 `narrated`，生成旁白混音 `soundtrack.wav` 与 SRT；`npm run captions` 将字幕和实际镜头长度写回场景。此时应另选导出文件名，避免与纯音乐成片混淆。

也可使用已安装的 OpenAI Speech skill CLI 替代 `generate-local.ps1`。需要本机配置 `OPENAI_API_KEY` 并有可用 API 额度；先运行 `prepare_speech.py`，再运行：

```powershell
python (Join-Path $env:USERPROFILE '.codex/skills/speech/scripts/text_to_speech.py') speak-batch --input ./audio-tools/tmp/speech/jobs.jsonl --out-dir ./public/audio/segments --rpm 30 --force
```

全部语音请求成功后，再运行混音和字幕同步命令。生成指令保存在 `voice-instructions.txt`，密钥不应写入项目文件。恢复纯音乐版本时需还原当前 `content.json` 的 48 秒时间线、音乐路径和 `music-only` 设置，再执行 `npm run captions`；仅重新生成音乐不会切换版本。
