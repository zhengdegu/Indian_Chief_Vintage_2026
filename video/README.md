# Chief Vintage 2026 · 中文 3D 宣传片

48.233 秒，1920 × 1080，30 fps。影片直接加载现有 GLB，包含六组连续相机运动、参数动效、中文旁白、13 条同步字幕和原创合成氛围音乐。

本版中文男声来自 Windows 离线语音 Microsoft Kangkang。OpenAI Speech API 小样请求返回账户额度不足，因此没有使用 OpenAI 生成音频。片尾自动读取 `content.json` 中的声源披露。此作品是依据公开资料制作的非官方 3D 概念宣传片。

## 预览和导出

在本目录运行：

需要 Node.js 20.19+ 或 22.12+，以及 PATH 中可用的 FFmpeg。恢复已提供的混音不需要 API 密钥；重新生成旁白的额外依赖见 [音频工具说明](audio-tools/README.md)。

```powershell
npm ci
npm run assets
npm run studio
```

预览地址为 `http://localhost:3001/ChiefFilm`。`Scenes` 文件夹内可单独预览六个镜头。项目默认使用 Windows 系统的 Impact、Georgia 和微软雅黑字体；其他系统应安装相应字体或调整字体栈。

```powershell
npm run check
npm run render
```

默认导出到 `out/Chief_Vintage_2026_CN_1080p.mp4`。Remotion 使用本机 Chrome 和 ANGLE WebGL；Chrome 路径在 `remotion.config.ts` 中。没有 GPU 时可将命令中的 `--gl=angle` 改为 `--gl=swangle`，渲染会更慢。

本次交付位于项目根目录的 `deliverables/Chief_Vintage_2026_CN_1080p.mp4`，并附同名 SRT 和封面 JPG。

## 可编辑内容

- `src/Stage.tsx`：六组镜头的起止位置、目标、视场角、画面偏移，以及模型灯光和材质设置。
- `src/scenes/`：六个独立场景的文案、参数布局、动画和字幕数组。
- `src/Film.tsx`：整片时间线与音轨；`src/Root.tsx`：主片和独立场景注册。
- `content.json`：讲解稿、官方资料来源、实际配音时长与字幕时间。
- `public/audio/`：完整混音、独立旁白、背景音乐、短句 WAV 和 SRT。
- `audio-tools/README.md`：离线重新生成配音，以及额度恢复后换用 OpenAI 语音的步骤。

换配音或修改讲解稿后，先依照音频说明重新生成混音，再运行 `npm run captions` 同步字幕与独立场景长度，最后重新导出。镜头运动全部根据帧号计算，因此逐帧导出和时间线定位保持一致。

GLB 与 Draco 解码器通过 `npm run assets` 从网页的 `../public/` 同步。原始 Blender 模型没有被修改。视频缓存、导出文件和 WAV 不加入 Git；可携带的混音 MP3 保留为源素材。若新环境没有 WAV，`npm run assets` 会使用 PATH 中的 FFmpeg 从 MP3 恢复音轨。需要无损分轨时，复制已有的 `public/audio/` 或运行音频脚本重新生成。

## 资料与声音

车辆参数来自项目中的官方 Chief Vintage 产品资料、Sturgis 特别版公告和 Cycle News 报道，链接保存在 `content.json`。底乐由本项目合成，不含商业音乐或真实发动机录音。声音经过时长、响度、峰值和字幕顺序检查；离线中文识别仅作辅助核验，不等同于真人试听。
