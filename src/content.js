// Vehicle facts: official Indian Motorcycle UK references retained in research/.
// UI content is deliberately separate from the real-time 3D presentation.
export const vehicle = {
  name: 'Chief Vintage',
  edition: 'Sturgis, SD Edition',
  year: '2026',
  brand: 'Indian Motorcycle',
  description: '经典轮廓，公路灵魂。以 3D 重新走近 Sturgis 限量版。',
};

export const chapters = [
  {
    id: 'hero',
    index: '01',
    eyebrow: '2026 · STURGIS, SD EDITION',
    title: '经典，从未停下。',
    subtitle: 'CHIEF VINTAGE',
    body: 'Indian Red 与 Cream 双色涂装，深裙边挡泥板，低伏的巡航姿态。让视线沿着每一道曲线，驶向开阔公路。',
    cue: '滚动探索',
  },
  {
    id: 'engine',
    index: '02',
    eyebrow: 'THUNDERSTROKE 116',
    title: '看得见的力量。',
    subtitle: 'AIR-COOLED V-TWIN',
    body: '1,890 cc 风冷 V 型双缸，是整车的机械核心。黑色散热鳍片、亮色推杆管与银色缸盖，构成层次分明的金属表情。',
    metrics: ['displacement', 'torque', 'vAngle'],
  },
  {
    id: 'craft',
    index: '03',
    eyebrow: 'CRAFTED TO BE SEEN',
    title: '每一处，都有来历。',
    subtitle: 'RED. CREAM. ESPRESSO.',
    body: '彩色羽冠徽记点缀双色油箱，Espresso 棕色独立座椅收束车身线条。辐条轮毂与发光羽冠饰件，让经典细节自然延续。',
    image: '/images/craft-detail.webp',
  },
  {
    id: 'chassis',
    index: '04',
    eyebrow: 'THE LONG VIEW',
    title: '从容，自成姿态。',
    subtitle: 'LOW. LONG. COMPOSED.',
    body: '1,626 mm 轴距与 686 mm 座高，勾勒出低重心的巡航轮廓。16 英寸辐条轮、伸缩前叉与双后减震器，清晰呈现机械结构。',
    metrics: ['wheelbase', 'seatHeight', 'wheelDiameter'],
  },
  {
    id: 'edition',
    index: '05',
    eyebrow: 'LIMITED TO 125 MOTORCYCLES',
    title: '为相聚，留下印记。',
    subtitle: 'STURGIS, SOUTH DAKOTA',
    body: '这款特别版在第 86 届 Sturgis 摩托车盛会上亮相，限量 125 台。侧盖上的 56 号图形，与红白配色共同构成它的专属识别。',
    metrics: ['production'],
    image: '/images/rear-view.webp',
  },
];

export const specs = [
  { id: 'displacement', label: '发动机排量', value: '1,890', unit: 'cc', group: 'engine', source: 'official-base' },
  { id: 'torque', label: '最大扭矩', value: '156', unit: 'N·m', group: 'engine', source: 'official-base' },
  { id: 'engineType', label: '发动机形式', value: 'Thunderstroke 116', unit: '风冷 V 型双缸', group: 'engine', source: 'official-edition' },
  { id: 'vAngle', label: '双缸夹角', value: '49', unit: '°', group: 'engine', source: 'cyclenews' },
  { id: 'fuel', label: '油箱容积', value: '15.1', unit: 'L', group: 'engine', source: 'official-base' },
  { id: 'finalDrive', label: '最终传动', value: '皮带', unit: '', group: 'engine', source: 'official-base' },
  { id: 'wheelbase', label: '轴距', value: '1,626', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'seatHeight', label: '座高', value: '686', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'length', label: '车长', value: '2,441', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'width', label: '车宽', value: '887', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'height', label: '车高', value: '1,175', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'clearance', label: '离地间隙', value: '125', unit: 'mm', group: 'dimensions', source: 'official-base' },
  { id: 'wheelDiameter', label: '辐条轮直径', value: '16', unit: 'in', group: 'chassis', source: 'official-base' },
  { id: 'frontTire', label: '前轮胎', value: '130/90 B16', unit: '', group: 'chassis', source: 'official-base' },
  { id: 'rearTire', label: '后轮胎', value: '150/80 B16', unit: '', group: 'chassis', source: 'official-base' },
  { id: 'frontTravel', label: '前悬挂行程', value: '132', unit: 'mm', group: 'chassis', source: 'official-base' },
  { id: 'rearTravel', label: '后悬挂行程', value: '75', unit: 'mm', group: 'chassis', source: 'official-base' },
  { id: 'brakeDiameter', label: '前 / 后制动盘', value: '298 / 298', unit: 'mm', group: 'chassis', source: 'official-base' },
  { id: 'production', label: '限量生产', value: '125', unit: '台', group: 'edition', source: 'official-edition' },
  { id: 'display', label: '圆形触控仪表', value: '101', unit: 'mm', group: 'edition', source: 'official-edition' },
];

export const specGroups = [
  { id: 'engine', label: '动力系统', english: 'POWERTRAIN', items: specs.filter((item) => item.group === 'engine') },
  { id: 'dimensions', label: '车身尺寸', english: 'DIMENSIONS', items: specs.filter((item) => item.group === 'dimensions') },
  { id: 'chassis', label: '底盘配置', english: 'CHASSIS', items: specs.filter((item) => item.group === 'chassis') },
  { id: 'edition', label: '特别版配置', english: 'EDITION', items: specs.filter((item) => item.group === 'edition') },
];

// Alias for layouts that use a shorter import name.
export const groups = specGroups;

export const features = [
  { id: 'paint', title: '双色涂装', text: 'Indian Motorcycle Red / Cream，配合彩色羽冠油箱徽记。' },
  { id: 'seat', title: 'Espresso 独立座椅', text: '棕色皮革质感与缝线细节，延续复古巡航的视觉语言。' },
  { id: 'fenders', title: '深裙边挡泥板', text: '大面积曲面包覆车轮，前端搭配发光羽冠饰件。' },
  { id: 'wheels', title: '16 英寸辐条轮', text: '黑色轮圈、金属辐条与 Metzeler Cruisetec 轮胎。' },
  { id: 'edition56', title: '56 号侧盖', text: '特别版图形与限量身份；页面模型未虚构单车出厂编号。' },
];

export const sources = [
  { id: 'official-edition', label: 'Indian Motorcycle · Sturgis 特别版公告', url: 'https://www.indianmotorcycle.co.uk/news/detail/indian-chief-vintage-sturgis/' },
  { id: 'official-base', label: 'Indian Motorcycle · Chief Vintage 官方参数', url: 'https://www.indianmotorcycle.co.uk/chief-vintage/' },
  { id: 'cyclenews', label: 'Cycle News · Sturgis 特别版资料', url: 'https://www.cyclenews.com/2026/08/article/2026-indian-chief-vintage-sturgis-sd-edition-specs-and-price/' },
];

export const projectNote = '非官方 3D 概念展示。模型依据公开实车照片与官方参数重建；局部曲面为视觉还原，产品配置以厂商发布为准。';
export const specificationNote = '尺寸与底盘参数采用官方 2026 Chief Vintage 资料；特别版公告未披露底盘结构变更。';
