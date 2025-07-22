// 本地存储服务 - 兼容版本
import { STORAGE_KEYS, DEFAULT_FOOD_CARDS } from '../utils/constants';

// 检查localStorage是否可用
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// 内存存储作为降级方案
const memoryStorage = {};

// 存储适配器
const storage = {
  getItem(key) {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return memoryStorage[key] || null;
  },
  
  setItem(key, value) {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('localStorage写入失败，使用内存存储:', e);
        memoryStorage[key] = value;
      }
    } else {
      memoryStorage[key] = value;
    }
  },
  
  removeItem(key) {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
    delete memoryStorage[key];
  }
};

export const storageService = {
  // 用户数据
  getUser(username) {
    const userData = storage.getItem(`user_${username}`);
    return userData ? JSON.parse(userData) : null;
  },

  setUser(username, userData) {
    storage.setItem(`user_${username}`, JSON.stringify(userData));
  },

  // 当前登录用户
  getCurrentUser() {
    return storage.getItem(STORAGE_KEYS.LOGGED_IN_USER) || '游客';
  },

  setCurrentUser(username) {
    storage.setItem(STORAGE_KEYS.LOGGED_IN_USER, username);
  },

  removeCurrentUser() {
    storage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
  },

  // 食材卡片
  getGlobalCards() {
    const data = storage.getItem(STORAGE_KEYS.GLOBAL_CARDS);
    if (!data) return [...DEFAULT_FOOD_CARDS];
    try {
      const arr = JSON.parse(data);
      return Array.isArray(arr) ? arr : [...DEFAULT_FOOD_CARDS];
    } catch {
      return [...DEFAULT_FOOD_CARDS];
    }
  },

  setGlobalCards(cards) {
    storage.setItem(STORAGE_KEYS.GLOBAL_CARDS, JSON.stringify(cards));
  },

  // 签到数据
  getCheckinDates(username) {
    const data = storage.getItem(STORAGE_KEYS.CHECKIN_DATES_PREFIX + username);
    return data ? JSON.parse(data) : [];
  },

  setCheckinDates(username, dates) {
    storage.setItem(STORAGE_KEYS.CHECKIN_DATES_PREFIX + username, JSON.stringify(dates));
  },

  // 积分数据
  getUserPoints(username) {
    return parseInt(storage.getItem(STORAGE_KEYS.POINTS_PREFIX + username) || '0', 10);
  },

  setUserPoints(username, points) {
    storage.setItem(STORAGE_KEYS.POINTS_PREFIX + username, points.toString());
  },

  // 排行榜数据
  getLeaderboard() {
    const data = storage.getItem(STORAGE_KEYS.LEADERBOARD);
    return data ? JSON.parse(data) : [];
  },

  setLeaderboard(leaderboard) {
    storage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  }
};