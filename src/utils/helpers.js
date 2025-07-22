// 辅助工具函数

// SHA-256加密 - 兼容版本
export async function sha256(message) {
  // 检查crypto.subtle是否可用（HTTPS环境）
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.warn('crypto.subtle不可用，使用降级方案:', error);
      return simpleSHA256(message);
    }
  } else {
    console.warn('crypto.subtle不可用，使用降级方案');
    return simpleSHA256(message);
  }
}

// 简单哈希函数作为降级方案（生产环境应使用真实的库如js-sha256）
function simpleSHA256(message) {
  let hash = 0;
  const str = message + 'salt_food_therapy_2024'; // 加盐
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  // 转换为正数并返回16进制字符串
  return Math.abs(hash).toString(16).padStart(8, '0') + 
         Math.abs(hash * 31).toString(16).padStart(8, '0');
}

// 计算本周的起始日期（周一）
export function getMonday(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// 语音播报
export function speak(text, lang = 'zh') {
  if (!text) return;
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === 'zh' ? 'zh-CN' : 'yue-HK';
  synth.speak(utter);
}

// 检查是否为管理员
export function isAdmin(username) {
  return username === 'swh';
}