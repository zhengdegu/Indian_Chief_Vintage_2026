# Chief Vintage 2026 · 3D 纯音乐宣传片

48 秒，1920 × 1080，30 fps，共 1440 帧。影片直接加载现有 GLB，以六组各 8 秒的镜头展示整车、发动机、双色涂装与皮革、底盘、特别版和收尾画面，保留车型参数动效。

默认版本配原创电子摇滚 / synthwave 音乐《Ride After Dark》：120 BPM、E minor、4/4 拍、24 小节。没有旁白和讲解字幕；生成音乐、预览和导出均无需 API。此作品是依据公开资料制作的非官方 3D 概念宣传片。

## 预览和导出

需要 Node.js 20.19+ 或 22.12+，以及 PATH 中可用的 FFmpeg。在本目录运行：

```powershell
npm ci
npm run assets
npm run studio
```

预览地址为 `http://localhost:3001/ChiefFilm`。`Scenes` 文件夹内可单独预览六个镜头。项目使用 Windows 系统的 Impact、Georgia 和微软雅黑字体；其他系统应安装相应字体或调整字体栈。

```powershell
npm run check
npm run render
```

默认导出到 `out/Chief_Vintage_2026_Music_1080p.mp4`。Remotion 使用本机 Chrome 和 ANGLE WebGL，Chrome 路径在 `remotion.config.ts` 中。没有 GPU 时，可将渲染命令中的 `--gl=angle` 改为 `--gl=swangle`，渲染会更慢。

本次制作工作区的交付文件位于仓库外，相对本目录为：

- `../../deliverables/Chief_Vintage_2026_Music_1080p.mp4`：纯音乐宣传片。
- `../../deliverables/Chief_Vintage_Ride_After_Dark.mp3`：独立配乐。

## 重新生成音乐

需要 Python 3.10+、NumPy 和 FFmpeg。在本目录运行：

```powershell
python -m pip install -r audio-tools/requirements.txt
python audio-tools/create_music_only.py
```

生成脚本不需要参数，完全在本机运行，输出 `public/audio/ride-after-dark.wav`、同名 MP3 和 `music-only-metadata.json`，并将独立 MP3 复制到交付目录。音乐按六组镜头的 8 秒边界编排，不含人声或发动机录音。完整说明及可选旧旁白工作流见 [音频工具说明](audio-tools/README.md)。

## 可编辑内容

- `src/Stage.tsx`：六组镜头的起止位置、目标、视场角、画面偏移、灯光和材质设置。
- `src/scenes/`：六个场景的文案、参数布局与动画。
- `src/Film.tsx`：整片时间线与音轨；`src/Root.tsx`：主片和独立场景注册。
- `content.json`：车辆资料来源、镜头时间、音乐路径与版本设置。旧旁白文案仅作为可选素材保留。
- `audio-tools/create_music_only.py`：鼓组、贝斯、失真和弦、合成器旋律、转场和母带处理。
- `public/audio/music-only-metadata.json`：音乐编排、格式、来源与响度测量记录。

镜头运动全部根据帧号计算。修改时间线后运行 `npm run captions`，同步独立场景长度；在 `music-only` 模式下，该命令会移除讲解字幕。

GLB 与 Draco 解码器通过 `npm run assets` 从网页的 `../public/` 同步。视频缓存、导出文件和 WAV 不加入 Git；音乐 MP3 保留为源素材。若新环境没有 WAV，同步脚本会使用 FFmpeg 从当前音乐 MP3 恢复音轨。需要原始 24 bit WAV 时，运行音乐生成脚本。

## 资料与检查

车辆参数来自官方 Chief Vintage 产品资料、Sturgis 特别版公告和 Cycle News 报道，链接保存在 `content.json`。模型没有因本次视频制作而修改。

配乐由项目代码合成，不使用第三方音乐或采样。记录中的 WAV 实测为 **-13.03 LUFS、-1.54 dBTP**，48 kHz、24 bit、立体声、48 秒。此处记录的是程序测量结果，不表示已完成真人试听。
