// 常量定义
export const ADMIN_USERNAME = 'swh';

// 本地存储键名
export const STORAGE_KEYS = {
  LOGGED_IN_USER: 'loggedInUser',
  GLOBAL_CARDS: 'globalCards',
  CHECKIN_DATES_PREFIX: 'checkin_dates_',
  POINTS_PREFIX: 'total_points_',
  LEADERBOARD: 'leaderboard_data'
};

// 默认食材卡片数据
export const DEFAULT_FOOD_CARDS = [
  {
    image: 'https://cdn.pixabay.com/photo/2017/01/20/00/30/mushrooms-1996417_960_720.jpg',
    title: '香菇',
    desc: '增强免疫力，补气养血。',
    link: 'https://example.com/product/xianggu'
  },
  {
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/ginger-1238243_960_720.jpg',
    title: '生姜',
    desc: '驱寒暖胃，促进消化。',
    link: 'https://example.com/product/shengjiang'
  }
];

// 人脸识别配置
export const FACE_DETECTION_CONFIG = {
  FACE_AREA_THRESHOLD: 50000,
  PROMPT_INTERVAL: 5000,
  MODEL_URL: 'https://justadudewhohacks.github.io/face-api.js/models/'
};