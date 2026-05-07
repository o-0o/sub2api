/**
 * Image Generation API endpoints
 * Handles image generation requests via /v1/images/generations
 */

import axios from 'axios'

export interface ImageGenerationRequest {
  model?: string
  prompt: string
  n?: number
  size?: '1024x1024' | '1024x1792' | '1792x1024' | '1536x1024' | '1024x1536' | '2048x2048' | '1024x2048' | '2048x1024'
  response_format?: 'url' | 'b64_json'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
  image?: File
  apiKey?: string
}

export interface ImageGenerationResult {
  created: number
  data: Array<{
    url?: string
    b64_json?: string
    revised_prompt?: string
  }>
}

export interface ImageGenerationResponse {
  model: string
  created: number
  data: Array<{
    url?: string
    b64_json?: string
    revised_prompt?: string
  }>
}

const IMAGES_API_BASE = import.meta.env.VITE_API_BASE_URL || '/v1'

/**
 * Generate images using the GPT Image 2 model
 * Uses API Key authentication (Bearer token)
 */
export async function generateImage(params: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const config: Record<string, unknown> = {}

  // Use API Key for authentication if provided
  if (params.apiKey) {
    config.headers = {
      Authorization: `Bearer ${params.apiKey}`
    }
  }

  if (params.image) {
    // Multipart form data for image reference
    const formData = new FormData()
    formData.append('model', params.model || 'gpt-image-2')
    formData.append('prompt', params.prompt)
    formData.append('n', String(params.n || 1))
    formData.append('size', params.size || '1024x1024')
    formData.append('response_format', params.response_format || 'url')
    formData.append('quality', params.quality || 'standard')
    formData.append('style', params.style || 'vivid')
    formData.append('image', params.image)

    const { data } = await axios.post<ImageGenerationResponse>(
      `${IMAGES_API_BASE}/images/generations`,
      formData,
      {
        ...config as any,
        headers: {
          ...(config.headers as Record<string, string>),
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 min for image generation
      }
    )
    return data
  }

  const { data } = await axios.post<ImageGenerationResponse>(
    `${IMAGES_API_BASE}/images/generations`,
    {
      model: params.model || 'gpt-image-2',
      prompt: params.prompt,
      n: params.n || 1,
      size: params.size || '1024x1024',
      response_format: params.response_format || 'url',
      quality: params.quality || 'standard',
      style: params.style || 'vivid',
    },
    {
      ...config as any,
      timeout: 300000,
    }
  )
  return data
}

// Template types
export interface ImageTemplate {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  prompt: string
  promptZh: string
  previewUrl: string
  size?: '1024x1024' | '1024x1792' | '1792x1024' | '1536x1024' | '1024x1536' | '2048x2048' | '1024x2048' | '2048x1024'
  quality?: 'standard' | 'hd'
  category: string
}

// Image Templates
export const IMAGE_TEMPLATES: ImageTemplate[] = [
  // 信息图类
  {
    id: 'city-infographic',
    name: 'City Metabolism Atlas',
    nameZh: '城市生命系统图谱',
    description: 'Vertical 9:16 isometric cutaway infographic of smart city',
    descriptionZh: '9:16竖版等距剖面信息图，智慧城市全貌',
    prompt: 'Vertical 9:16 isometric cutaway infographic "城市生命系统图谱 / Urban Metabolism Atlas". Smart city from sky to bedrock, 12 bilingual annotation panels, technical blueprint style, detailed city infrastructure',
    promptZh: 'Vertical 9:16 isometric cutaway infographic "城市生命系统图谱 / Urban Metabolism Atlas". Smart city from sky to bedrock, 12 bilingual annotation panels, technical blueprint style, detailed city infrastructure',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case1.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },
  {
    id: 'food-infographic',
    name: 'Recipe Infographic',
    nameZh: '食谱信息图',
    description: '9:16 vertical food recipe flowchart infographic',
    descriptionZh: '9:16竖版食谱流程信息图',
    prompt: 'Visual design specs: 9:16 aspect ratio (vertical mobile infographic); background texture with breathing handmade paper feel; warm color palette; step-by-step cooking instructions with clear numbers; hand-drawn style elements',
    promptZh: '视觉设计规格描述：画幅比 9:16（竖版手机信息图）；背景纹理为具有呼吸感的米色手工纸；温暖的色调；带有清晰编号的分步烹饪说明；手绘风格元素',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case14.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },
  {
    id: 'medical-infographic',
    name: 'Medical Infographic',
    nameZh: '医学信息图',
    description: 'Comprehensive medical infographic with detailed illustrations',
    descriptionZh: '综合医学信息图，详细解剖插图',
    prompt: 'type: comprehensive medical infographic, style: highly detailed anatomical illustrations, professional medical color scheme, scientific accuracy, multiple modules showing cause and effect chain',
    promptZh: 'type: comprehensive medical infographic, style: highly detailed anatomical illustrations, professional medical color scheme, scientific accuracy, multiple modules showing cause and effect chain',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case67.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },
  {
    id: 'fashion-infographic',
    name: 'Fashion Process',
    nameZh: '女装设计因果链',
    description: 'Fashion design process infographic',
    descriptionZh: '女装设计因果链信息图',
    prompt: "type: fashion design process infographic, title: 一件女装诞生的因果链 THE CAUSAL CHAIN OF A WOMEN'S GARMENT, detailed flow showing design, materials, production, complete process",
    promptZh: "type: fashion design process infographic, title: 一件女装诞生的因果链 THE CAUSAL CHAIN OF A WOMEN'S GARMENT, detailed flow showing design, materials, production, complete process",
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case66.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },
  {
    id: 'ev-infographic',
    name: 'Evolution Timeline',
    nameZh: '人类演化时间线',
    description: 'Evolutionary timeline infographic on vintage parchment',
    descriptionZh: '复古羊皮纸风格人类演化时间线',
    prompt: 'type: evolutionary timeline infographic, style: vintage parchment aesthetic, using REFERENCE_0 as structural base, detailed human evolution stages, bilingual annotations',
    promptZh: 'type: evolutionary timeline infographic, style: vintage parchment aesthetic, using REFERENCE_0 as structural base, detailed human evolution stages, bilingual annotations',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case23.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },
  {
    id: 'botanical-infographic',
    name: 'Botanical Poster',
    nameZh: '植物生长图谱',
    description: 'Scientific botanical infographic poster',
    descriptionZh: '科学植物学信息图海报',
    prompt: 'type: scientific botanical infographic poster, subject: Pomegranate (Punica granatum), detailed plant anatomy, growth stages, cross-section diagrams, educational style',
    promptZh: 'type: scientific botanical infographic poster, subject: Pomegranate (Punica granatum), detailed plant anatomy, growth stages, cross-section diagrams, educational style',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case72.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'infographic',
  },

  // 海报版式类
  {
    id: 'city-poster-beijing',
    name: 'Beijing Poster',
    nameZh: '北京城市海报',
    description: '2026 China city promotional poster, Guoman style',
    descriptionZh: '2026中国城市系列宣传海报，国潮风格',
    prompt: '2026中国城市系列宣传海报，主题为【北京】。现代、多彩、明亮通透的国潮风，竖版9:16，红绸盘旋融入城市地标建筑，故宫、天坛、长城元素，金色点缀',
    promptZh: '2026中国城市系列宣传海报，主题为【北京】。现代、多彩、明亮通透的国潮风，竖版9:16，红绸盘旋融入城市地标建筑，故宫、天坛、长城元素，金色点缀',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case9.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },
  {
    id: 'city-poster-guangzhou',
    name: 'Guangzhou Poster',
    nameZh: '广州城市海报',
    description: 'Oriental fantasy style Guangzhou city poster',
    descriptionZh: '东方幻想风格广州城市海报',
    prompt: 'Flat illustration, high-end oriental fantasy style city poster design, vertical 9:16 composition, Guangzhou landmarks with golden energy flow, Chinese ink painting fusion, dramatic lighting',
    promptZh: 'Flat illustration, high-end oriental fantasy style city poster design, vertical 9:16 composition, Guangzhou landmarks with golden energy flow, Chinese ink painting fusion, dramatic lighting',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case58.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },
  {
    id: 'retro-poster',
    name: 'Retro Propaganda',
    nameZh: '复古宣传画',
    description: '80s vintage propaganda poster style',
    descriptionZh: '八十年代复古宣传画风格',
    prompt: '生成八十年代宣传画，标语"热烈庆祝GPT-Image-2全量开放"，人物包含Sam Altman、Dario Amodei、Elon Musk，社会主义宣传画风格，鲜艳红色黄色调',
    promptZh: '生成八十年代宣传画，标语"热烈庆祝GPT-Image-2全量开放"，人物包含Sam Altman、Dario Amodei、Elon Musk，社会主义宣传画风格，鲜艳红色黄色调',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case10.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },
  {
    id: 'football-poster',
    name: 'Football Movie Poster',
    nameZh: '足球电影海报',
    description: 'Football theme cinematic movie poster',
    descriptionZh: '足球主题电影海报',
    prompt: '生成一张「足球主题电影海报」风格的高清写真海报：国际米兰后卫巴斯托尼站在圣西罗球场中央激情庆祝，球衣飞扬，冠军光环，电影级打光，竖版构图',
    promptZh: '生成一张「足球主题电影海报」风格的高清写真海报：国际米兰后卫巴斯托尼站在圣西罗球场中央激情庆祝，球衣飞扬，冠军光环，电影级打光，竖版构图',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case3.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },
  {
    id: 'double-exposure-poster',
    name: 'Double Exposure',
    nameZh: '双重曝光海报',
    description: 'Double exposure artistic composition poster',
    descriptionZh: '双重曝光艺术构图海报',
    prompt: '生成高完成度史诗感艺术海报，双重曝光构图，米白色背景，球队：xxxx队，人物剪影与燃烧球场融合，极简主义高端质感',
    promptZh: '生成高完成度史诗感艺术海报，双重曝光构图，米白色背景，球队：xxxx队，人物剪影与燃烧球场融合，极简主义高端质感',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case16.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },
  {
    id: 'comic-poster',
    name: 'Comic Movie Poster',
    nameZh: '漫画电影海报',
    description: '3D CGI animation style movie poster',
    descriptionZh: '3D CGI动画风格电影宣传海报',
    prompt: 'type: cinematic promotional poster, style: 3D CGI animation style, highly detailed, dramatic lighting, caricature characters, Japanese manga aesthetic, vertical composition',
    promptZh: 'type: cinematic promotional poster, style: 3D CGI animation style, highly detailed, dramatic lighting, caricature characters, Japanese manga aesthetic, vertical composition',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case59.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'poster',
  },

  // UI界面类
  {
    id: 'social-media-ui',
    name: 'Social Media Post',
    nameZh: '社媒帖子截图',
    description: 'Social media post screenshot mockup',
    descriptionZh: '社交媒体帖子截图模拟',
    prompt: '画一张 X 的内容截图，深色模式，@OpenAI 蓝勾认证账号发推，展示AI Builder创作者推荐内容及互动数据，真实UI还原',
    promptZh: '画一张 X 的内容截图，深色模式，@OpenAI 蓝勾认证账号发推，展示AI Builder创作者推荐内容及互动数据，真实UI还原',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case2.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'ui',
  },
  {
    id: 'twitter-ui',
    name: 'Twitter/X UI',
    nameZh: 'Twitter/X帖子',
    description: 'Twitter/X dark mode UI mockup',
    descriptionZh: 'Twitter/X暗模式UI模拟',
    prompt: 'type: mobile social media app UI mockup, platform: Twitter/X dark mode, verified badge, blue checkmark, realistic tweet interface with engagement metrics',
    promptZh: 'type: mobile social media app UI mockup, platform: Twitter/X dark mode, verified badge, blue checkmark, realistic tweet interface with engagement metrics',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case57.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'ui',
  },
  {
    id: 'douyin-live',
    name: 'Douyin Live',
    nameZh: '抖音直播截图',
    description: 'Douyin/TikTok live stream UI mockup',
    descriptionZh: '抖音直播界面模拟',
    prompt: 'A 9:16 aspect ratio image, generating a screenshot of a Douyin livestream, professional streamer with audience count visible, gifts animation, chat messages, realistic Douyin UI',
    promptZh: 'A 9:16 aspect ratio image, generating a screenshot of a Douyin livestream, professional streamer with audience count visible, gifts animation, chat messages, realistic Douyin UI',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case48.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'ui',
  },
  {
    id: 'live-stream-ui',
    name: 'Live Stream UI',
    nameZh: '直播带货界面',
    description: 'Elon Musk live stream e-commerce UI',
    descriptionZh: '马斯克直播带货界面',
    prompt: 'type: live stream UI mockup, subject: portrait of Elon Musk, smiling, wearing a black t-shirt, live shopping interface with product cards, purchase buttons, viewer count',
    promptZh: 'type: live stream UI mockup, subject: portrait of Elon Musk, smiling, wearing a black t-shirt, live shopping interface with product cards, purchase buttons, viewer count',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case21.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'ui',
  },

  // 插画艺术类
  {
    id: 'anime-illustration',
    name: 'Anime Illustration',
    nameZh: '动漫插画',
    description: 'Japanese anime fantasy illustration',
    descriptionZh: '日系唯美奇幻动漫插画',
    prompt: '参考图是角色人设图，为参考图的少女绘制一副日系唯美奇幻风格插画，梦幻流星、水面反射、月光效果，柔和色调，Studio Ghibli aesthetic',
    promptZh: '参考图是角色人设图，为参考图的少女绘制一副日系唯美奇幻风格插画，梦幻流星、水面反射、月光效果，柔和色调，Studio Ghibli aesthetic',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case6.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'illustration',
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts Battle',
    nameZh: '武术对决',
    description: 'Anime-style martial arts battle illustration',
    descriptionZh: '动漫风格武术对决插画',
    prompt: 'An anime-style illustration of a high-impact martial arts battle between two young female fighters, dynamic action poses, energy effects, dramatic lighting, cel shading',
    promptZh: 'An anime-style illustration of a high-impact martial arts battle between two young female fighters, dynamic action poses, energy effects, dramatic lighting, cel shading',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case22.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'illustration',
  },
  {
    id: 'chinese-ink',
    name: 'Chinese Ink Painting',
    nameZh: '水墨美食地图',
    description: 'Traditional Chinese ink wash illustration',
    descriptionZh: '传统中国水墨画风格',
    prompt: 'type: illustrated map infographic, style: watercolor and ink hand-drawn illustration on vintage parchment, Chinese city food map, bird eye view, traditional Chinese aesthetics',
    promptZh: 'type: illustrated map infographic, style: watercolor and ink hand-drawn illustration on vintage parchment, Chinese city food map, bird eye view, traditional Chinese aesthetics',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case18.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'illustration',
  },
  {
    id: 'gongbi-painting',
    name: 'Gongbi Painting',
    nameZh: '工笔画',
    description: 'Traditional Chinese Gongbi style painting',
    descriptionZh: '传统中国工笔画风格',
    prompt: '唐朝贵妇遛粉色马甲异形工笔画，工笔细描，唐代服饰，异形生物，粉色马甲怪，精致线条，传统国画矿物颜料',
    promptZh: '唐朝贵妇遛粉色马甲异形工笔画，工笔细描，唐代服饰，异形生物，粉色马甲怪，精致线条，传统国画矿物颜料',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case174.jpg',
    size: '1024x1536',
    quality: 'hd',
    category: 'illustration',
  },
  {
    id: 'steampunk-poster',
    name: 'Steampunk Zodiac',
    nameZh: '蒸汽朋克星象图',
    description: 'Steampunk style zodiac anatomy poster',
    descriptionZh: '蒸汽朋克风格星座解剖图海报',
    prompt: '复古蒸汽朋克风格射手座解剖图谱海报，黄铜齿轮，维多利亚美学，精密机械结构，星象图案，博物馆展品风格',
    promptZh: '复古蒸汽朋克风格射手座解剖图谱海报，黄铜齿轮，维多利亚美学，精密机械结构，星象图案，博物馆展品风格',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case179.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'illustration',
  },
  {
    id: 'vttuber-profile',
    name: 'VTuber Profile',
    nameZh: 'VTuber资料卡',
    description: 'VTuber profile sheet with stats',
    descriptionZh: 'VTuber角色资料卡',
    prompt: 'type: VTuber profile sheet, theme: purple and white, elegant, lace, ribbon motifs, character design with detailed stats panel, clean professional layout',
    promptZh: 'type: VTuber profile sheet, theme: purple and white, elegant, lace, ribbon motifs, character design with detailed stats panel, clean professional layout',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case41.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'illustration',
  },

  // 摄影风格类
  {
    id: 'film-photo',
    name: '35mm Film Photo',
    nameZh: '35mm胶片照',
    description: 'Vintage 35mm film photography aesthetic',
    descriptionZh: '复古35mm胶片摄影美学',
    prompt: 'A vintage 35mm film photograph of a young Asian woman with long dark wavy hair, natural window lighting, shallow depth of field, Kodak Portra 400, nostalgic mood',
    promptZh: 'A vintage 35mm film photograph of a young Asian woman with long dark wavy hair, natural window lighting, shallow depth of field, Kodak Portra 400, nostalgic mood',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case26.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'photo',
  },
  {
    id: 'portrait-grid',
    name: 'Portrait Grid',
    nameZh: '人像网格',
    description: '2x2 professional portrait grid',
    descriptionZh: '2x2职业人像网格',
    prompt: 'type: 2x2 portrait grid, subject: young adult East Asian male with short black hair, consistent identity across frames, professional headshots, different angles',
    promptZh: 'type: 2x2 portrait grid, subject: young adult East Asian male with short black hair, consistent identity across frames, professional headshots, different angles',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case28.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'photo',
  },
  {
    id: 'bw-portrait',
    name: 'B&W Portrait',
    nameZh: '黑白肖像',
    description: 'Black and white portrait with dramatic lighting',
    descriptionZh: '黑白肖像戏剧性光线',
    prompt: 'A striking black and white close-up portrait of a handsome young Asian man with messy wet hair, dramatic rim lighting, film noir aesthetic, high contrast',
    promptZh: 'A striking black and white close-up portrait of a handsome young Asian man with messy wet hair, dramatic rim lighting, film noir aesthetic, high contrast',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case45.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'photo',
  },
  {
    id: 'kimono-portrait',
    name: 'Kimono Portrait',
    nameZh: '和服人像',
    description: 'Japanese kimono portrait with autumn garden',
    descriptionZh: '日式和服女性秋季庭院肖像',
    prompt: 'A photorealistic portrait with shallow depth of field and soft bokeh of a young Japanese woman in traditional kimono, autumn maple garden background, elegant pose',
    promptZh: 'A photorealistic portrait with shallow depth of field and soft bokeh of a young Japanese woman in traditional kimono, autumn maple garden background, elegant pose',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case35.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'photo',
  },

  // 产品与电商类
  {
    id: '3d-product',
    name: '3D Product Render',
    nameZh: '3D产品渲染',
    description: '3D rendered product showcase',
    descriptionZh: '3D渲染可爱产品展示',
    prompt: 'A 3D render of a cute kawaii cloud character on a pure white background, clay render style, soft pastel colors, professional product photography lighting',
    promptZh: 'A 3D render of a cute kawaii cloud character on a pure white background, clay render style, soft pastel colors, professional product photography lighting',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case33.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'product',
  },
  {
    id: 'vr-exploded',
    name: 'VR Exploded View',
    nameZh: 'VR爆炸图',
    description: 'VR headset exploded view product diagram',
    descriptionZh: 'VR头显9层爆炸图',
    prompt: 'type: exploded view product diagram poster, subject: VR headset, style: clean high-tech 3D render, 9 layers explosion view, Japanese technical annotations, professional poster layout',
    promptZh: 'type: exploded view product diagram poster, subject: VR headset, style: clean high-tech 3D render, 9 layers explosion view, Japanese technical annotations, professional poster layout',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case17.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'product',
  },
  {
    id: 'ecommerce-banner',
    name: 'E-commerce Banner',
    nameZh: '亚马逊A+详情图',
    description: 'Amazon A+ detail page banner',
    descriptionZh: '亚马逊A+详情图套装',
    prompt: '亚马逊A+详情图套装，专业商品摄影，生活场景展示，清晰产品卖点，简洁现代设计，高转化率布局',
    promptZh: '亚马逊A+详情图套装，专业商品摄影，生活场景展示，清晰产品卖点，简洁现代设计，高转化率布局',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case178.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'product',
  },
  {
    id: 'coffee-machine',
    name: 'Coffee Machine',
    nameZh: '咖啡机产品图',
    description: 'Fully automatic coffee machine product showcase',
    descriptionZh: '全自动咖啡机电商详情图',
    prompt: '全自动咖啡机电商详情图，专业产品摄影，温暖咖啡厅氛围，详细功能展示，高端质感',
    promptZh: '全自动咖啡机电商详情图，专业产品摄影，温暖咖啡厅氛围，详细功能展示，高端质感',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case190.jpg',
    size: '1024x1792',
    quality: 'hd',
    category: 'product',
  },

  // 角色设计类
  {
    id: 'expression-grid',
    name: 'Expression Grid',
    nameZh: '表情网格图',
    description: '3x3 character expression reference grid',
    descriptionZh: '3x3角色表情参考网格',
    prompt: 'type: 3x3 character expression grid, style: 3D animation, Pixar style, consistent character design, different emotions shown through paper tear holes, clean white background',
    promptZh: 'type: 3x3 character expression grid, style: 3D animation, Pixar style, consistent character design, different emotions shown through paper tear holes, clean white background',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case32.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'character',
  },
  {
    id: 'avatar-grid',
    name: 'Avatar Grid',
    nameZh: '角色头像网格',
    description: 'Character avatar grid with theme',
    descriptionZh: '主题角色头像网格',
    prompt: 'type: character avatar grid, theme: Journey to the West mythology, circular avatar design, 15 characters, Tang Sanzang, Sun Wukong, Zhu Bajie, Sha Wujing, detailed character icons',
    promptZh: 'type: character avatar grid, theme: Journey to the West mythology, circular avatar design, 15 characters, Tang Sanzang, Sun Wukong, Zhu Bajie, Sha Wujing, detailed character icons',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case34.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'character',
  },
  {
    id: 'got-characters',
    name: 'GOT Characters',
    nameZh: '权游角色网格',
    description: 'Game of Thrones character portrait grid',
    descriptionZh: '冰与火之歌角色3x3网格',
    prompt: 'type: character portrait grid, theme: Game of Thrones characters, flat illustration style, 3x3 grid layout, iconic characters, consistent art direction',
    promptZh: 'type: character portrait grid, theme: Game of Thrones characters, flat illustration style, 3x3 grid layout, iconic characters, consistent art direction',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case43.jpg',
    size: '1024x1024',
    quality: 'hd',
    category: 'character',
  },

  // 游戏与像素类
  {
    id: 'pixel-items',
    name: 'Pixel Item Grid',
    nameZh: '像素道具网格',
    description: '10x10 pixel art item grid RPG style',
    descriptionZh: '10x10像素艺术道具网格RPG风格',
    prompt: '10x10 pixel art items grid, consistent RPG game aesthetic, NES color palette, fantasy weapons and potions, organized grid layout, retro gaming style',
    promptZh: '10x10 pixel art items grid, consistent RPG game aesthetic, NES color palette, fantasy weapons and potions, organized grid layout, retro gaming style',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case186.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'game',
  },
  {
    id: 'minecraft-skin',
    name: 'Minecraft Skin',
    nameZh: 'Minecraft皮肤',
    description: 'Minecraft character skin design',
    descriptionZh: 'Minecraft角色皮肤设计',
    prompt: 'create a minecraft skin inspired by my look, pixel art style, front and back view, Steve model proportions, custom design based on reference photo',
    promptZh: 'create a minecraft skin inspired by my look, pixel art style, front and back view, Steve model proportions, custom design based on reference photo',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case25.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'game',
  },

  // 贴纸与图标类
  {
    id: 'line-stickers',
    name: 'Line Stickers',
    nameZh: 'LINE贴纸',
    description: 'Cute line sticker style illustrations',
    descriptionZh: '可爱LINE贴纸风格插画',
    prompt: 'Create 24 LINE stickers of animals in a quirky hand-drawn style, kawaii aesthetic, white outlines, transparent background, variety of cute poses and expressions',
    promptZh: 'Create 24 LINE stickers of animals in a quirky hand-drawn style, kawaii aesthetic, white outlines, transparent background, variety of cute poses and expressions',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case37.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'sticker',
  },
  {
    id: 'fitness-icons',
    name: 'Fitness Icons',
    nameZh: '健身图标',
    description: 'Fitness app iconfont design',
    descriptionZh: '健身类app iconfont图标设计',
    prompt: '运动类app iconfont图标字体设计，简洁线条风格，多个运动动作图标，统一设计语言，适合移动应用',
    promptZh: '运动类app iconfont图标字体设计，简洁线条风格，多个运动动作图标，统一设计语言，适合移动应用',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case247.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'sticker',
  },

  // 特殊效果类
  {
    id: 'graffiti-sketch',
    name: 'Graffiti Sketch',
    nameZh: '涂鸦速写',
    description: 'Graffiti sketch style portrait',
    descriptionZh: '涂鸦速写风格人像',
    prompt: 'Express a powerful AI builder in a graffiti sketch style, presenting an overall visual effect of quick outlines, bold strokes, spray paint aesthetic, urban wall art',
    promptZh: 'Express a powerful AI builder in a graffiti sketch style, presenting an overall visual effect of quick outlines, bold strokes, spray paint aesthetic, urban wall art',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case30.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'special',
  },
  {
    id: 'whiteboard-drawing',
    name: 'Whiteboard Drawing',
    nameZh: '白板涂鸦',
    description: 'Whiteboard marker drawing illustration',
    descriptionZh: '白板干擦笔画插画',
    prompt: 'A realistic photograph of a whiteboard with a highly detailed green dry-erase marker drawing of a samurai character, comedic style, exaggerated proportions, manzai theater vibe',
    promptZh: 'A realistic photograph of a whiteboard with a highly detailed green dry-erase marker drawing of a samurai character, comedic style, exaggerated proportions, manzai theater vibe',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case52.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'special',
  },
  {
    id: 'meme-comic',
    name: 'Meme Collage',
    nameZh: '表情包拼贴',
    description: '5-panel meme collage',
    descriptionZh: '5格表情包拼贴画',
    prompt: 'type: 5-panel collage, layout: grid with 3 top panels and 2 bottom panels, thematic objects: clock, playing cards, wine glass, chess board, dice, surreal meme style',
    promptZh: 'type: 5-panel collage, layout: grid with 3 top panels and 2 bottom panels, thematic objects: clock, playing cards, wine glass, chess board, dice, surreal meme style',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case60.jpg',
    size: '1024x1024',
    quality: 'standard',
    category: 'special',
  },

  // 场景与环境类
  {
    id: 'gothic-hall',
    name: 'Gothic Hall',
    nameZh: '哥特式大厅',
    description: 'Dark gothic interior scene',
    descriptionZh: '黑暗哥特大厅场景',
    prompt: 'A highly detailed, cinematic wide shot of a grand, dark gothic hall with a dark fantasy aesthetic, dramatic volumetric lighting, mysterious atmosphere, kneeling figure with violin',
    promptZh: 'A highly detailed, cinematic wide shot of a grand, dark gothic hall with a dark fantasy aesthetic, dramatic volumetric lighting, mysterious atmosphere, kneeling figure with violin',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case50.jpg',
    size: '1792x1024',
    quality: 'hd',
    category: 'scene',
  },
  {
    id: 'anime-scene',
    name: 'Anime Scene',
    nameZh: '动漫场景',
    description: 'Anime mech girl scene',
    descriptionZh: '机甲少女动漫主视觉',
    prompt: '16:9动漫主视觉风格，机甲少女立于废弃海城，赛博朋克氛围，末日废墟背景，精致机械细节，戏剧性光线',
    promptZh: '16:9动漫主视觉风格，机甲少女立于废弃海城，赛博朋克氛围，末日废墟背景，精致机械细节，戏剧性光线',
    previewUrl: 'https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/images/case224.jpg',
    size: '1792x1024',
    quality: 'hd',
    category: 'scene',
  },
]
