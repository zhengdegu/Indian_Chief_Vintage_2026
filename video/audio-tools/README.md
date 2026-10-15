# 中文旁白与原创氛围音乐

本次成片旁白采用 **Windows 离线中文合成语音 Microsoft Kangkang**，不是 OpenAI 生成的语音。已经尝试 OpenAI Speech API 小样，但账户返回 HTTP 429 `credit_balance_exhausted`，没有产生 OpenAI 音频。本目录没有密钥；所有 API 操作通过已安装的官方 Speech skill CLI 完成。

配音稿来自项目已核实的车辆资料，正式英文车型名保留在画面中。所有旁白数字都在输入稿中写成中文读数。底乐为本项目用正弦波、和弦音色和 74 BPM 轻脉冲合成的原创声音，没有取用商用音乐、真实发动机录音或音色克隆。

## 成果

- `../content.json`：文案、来源、镜头帧边界、声源披露与实测字幕时间。
- `../public/audio/soundtrack.wav`：用于成片的完整立体声混音，48 kHz / 16 bit / 48.233333 秒。
- `../public/audio/soundtrack.mp3`：192 kbps 试听副本。
- `../public/audio/narration.wav` / `music.wav`：可独立编辑的旁白与原创底乐。
- `../public/audio/01-hero.wav` 等：六个镜头的独立旁白。
- `../public/audio/narration.srt`：13 条 UTF-8 字幕。
- `../public/audio/segments/`：11 条原始短句，便于替换与重新同步。

30 fps 时间表：

| 镜头 | 起始帧 | 帧数 |
|---|---:|---:|
| hero | 0 | 209 |
| engine | 209 | 278 |
| craft | 487 | 286 |
| chassis | 773 | 254 |
| edition | 1027 | 270 |
| closing | 1297 | 150 |

合计 **1447 帧**。`subtitleCues` 的 `start`/`end` 是整片绝对秒数；`startFrame` / `durationFrames` 是准确整数帧。使用单条 `soundtrack.wav` 从第 0 帧播放即可；每个镜头的独立 WAV 应从 `speechStart` 对齐。

## 重做本地中文配音

需要 Python 3.10+、PATH 中可用的 FFmpeg / FFprobe，以及 Windows 中文语音 Microsoft Kangkang。首次运行时，在 `video` 目录安装混音依赖：

```powershell
python -m pip install -r .\audio-tools\requirements.txt
```

然后在 `video` 目录运行：

```powershell
python .\audio-tools\prepare_speech.py --regenerate
& .\audio-tools\generate-local.ps1
python .\audio-tools\build_audio.py
python .\scripts\sync-captions.py
& .\audio-tools\check-recognition.ps1
Remove-Item -LiteralPath .\audio-tools\tmp\speech\jobs.jsonl
```

`generate-local.ps1` 使用 Kangkang、Rate=-1，离线生成音频。`build_audio.py` 读取 WAV 实际时长，保守裁剪句首句尾静音，计算镜头与字幕边界，生成底乐与混音。它不访问网络或凭据。改变旁白文本或声音后，必须重新使用生成的 `durationInFrames` 和镜头时间表进行渲染。

## 改用 OpenAI 配音

账户恢复 API 额度后，在本机设置 `OPENAI_API_KEY`，不要写入源文件或输出到终端。在 `video` 目录运行已安装 Speech skill 的 CLI：

```powershell
python .\audio-tools\prepare_speech.py --regenerate
python (Join-Path $env:USERPROFILE '.codex\skills\speech\scripts\text_to_speech.py') speak-batch --input .\audio-tools\tmp\speech\jobs.jsonl --out-dir .\public\audio\segments --rpm 30 --force
python .\audio-tools\build_audio.py
python .\scripts\sync-captions.py
Remove-Item -LiteralPath .\audio-tools\tmp\speech\jobs.jsonl
```

待全部 API 请求成功后再运行混音。默认模型 `gpt-4o-mini-tts-2025-12-15`、声音 `cedar`、WAV、speed=1.0；原始指令保存在 `voice-instructions.txt`。混音脚本会更新 `content.json` 的语音来源披露，重新渲染时应引用此字段。该升级不会改变可编辑的 Blender 模型。

## 检查结果与边界

最终混音实测约 **-17.07 LUFS、-1.19 dBTP**，无数字削波；音乐约 -31 LUFS，并按实际旁白能量进一步降低音量。字幕时间来自短句实际长度及长句内静音位置。

已使用 Windows 中文离线听写器对六个镜头进行辅助检查，原始结果保存在 `recognition-qa.json`。1890、49、156、1626、686 和 56 被正确识别；旧识别器把“125 台”写成“120 舞台”，对年份数字串和专名也有误识别，不能把这些文本当成可信的逐字转录。当前环境没有完成真人听音验收，文档不声称已人工试听。最终影片保留准确文字参数和字幕，避免专名语音识别歧义影响信息获取。
