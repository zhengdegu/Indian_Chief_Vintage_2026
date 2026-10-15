# 网页资产与参数来源

本页面为非官方 3D 概念展示。页面模型是依据公开实车照片与官方尺寸制作的可编辑外观模型；隐藏结构及部分局部曲面为照片推定，不是厂商 CAD。Indian Motorcycle 等名称与识别元素用于描述所展示车型，不代表厂商授权或合作。

## 公开资料

- Indian Motorcycle UK，Sturgis, SD Edition 官方公告：<https://www.indianmotorcycle.co.uk/news/detail/indian-chief-vintage-sturgis/>。支持限量 125 台、第 86 届 Sturgis 盛会、红 / 奶油双色、彩色羽冠油箱图形、56 号侧盖、Espresso 独立座椅及 101 mm 仪表。
- Indian Motorcycle UK，Chief Vintage 官方车型与参数：<https://www.indianmotorcycle.co.uk/chief-vintage/>。提供 1,890 cc、156 N·m、1,626 mm 轴距、686 mm 座高、车身尺寸与底盘等参数。特别版公告未披露底盘结构变化，页面明确采用其共同基础车型数据。
- Cycle News，特别版发布资料与实车新闻图片：<https://www.cyclenews.com/2026/08/article/2026-indian-chief-vintage-sturgis-sd-edition-specs-and-price/>。提供 49° V 型双缸夹角等交叉参考。
- 研究底稿和参考照片归档保留在原始制作工作区；本仓库保留上述公开来源与下方纹理处理说明。

扭矩使用官方 UK 的 **156 N·m**；不混用第三方报道中与此不等值的 120 lb-ft。页面不提供未经核实的马力、售价或虚构单车序列号。

## 页面图片

以下图片是本项目 Blender 模型的渲染图，经 Pillow 缩放并编码为 WebP；不是实车照片。它们用于加载占位、不支持 WebGL 时的回退显示，以及细节补充。页面主展示应加载真实 3D 网格。

| 网页路径 | 本地渲染来源 | 输出尺寸 | 编码 |
|---|---|---|---|
| `/images/poster.webp` | 制作工作区的 `hero_right.png` | 1600 × 1152 | WebP，quality 84 |
| `/images/craft-detail.webp` | 制作工作区的 `seat_tank_detail.png` | 1200 × 864 | WebP，quality 84 |
| `/images/rear-view.webp` | 制作工作区的 `rear.png` | 1200 × 864 | WebP，quality 84 |

车辆表面纹理中包含依据真实车辆新闻照片提取与整理的品牌图形。详见 [油箱纹理来源](docs/TEXTURE_PROVENANCE.md)。公开商业发布前，请结合使用场景确认品牌、参考图片及其衍生纹理的使用权。

## 推荐叙事

1. **整车**：红 / 奶油双色与低伏轮廓；缓慢三分之四视角运镜。
2. **动力**：向发动机推进；1,890 cc、156 N·m、49° 作为少量醒目参数。
3. **工艺**：油箱徽记、棕色座椅、深裙边挡泥板；展示可观察的材质细节。
4. **姿态**：回到侧面与车身轮廓；1,626 mm 轴距、686 mm 座高、16 英寸辐条轮。
5. **特别版**：旋转到后部后回到全车；以限量 125 台与 Sturgis 身份收尾。

可用“自动巡游 / 自由探索”控制切换定向叙事与模型轨道交互；尊重系统减少动态效果偏好。
