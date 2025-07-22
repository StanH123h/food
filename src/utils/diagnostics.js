// 部署环境诊断工具

export const diagnostics = {
  // 检查运行环境
  checkEnvironment() {
    const results = {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      isSecure: window.location.protocol === 'https:',
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      localStorage: this.checkLocalStorage(),
      cryptoSubtle: this.checkCryptoSubtle(),
      userAgent: navigator.userAgent
    };
    
    console.group('🔍 部署环境诊断');
    console.table(results);
    console.groupEnd();
    
    return results;
  },

  // 检查localStorage
  checkLocalStorage() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return { available: true, error: null };
    } catch (e) {
      return { available: false, error: e.message };
    }
  },

  // 检查crypto.subtle
  checkCryptoSubtle() {
    const available = typeof crypto !== 'undefined' && !!crypto.subtle;
    return { 
      available,
      error: available ? null : 'crypto.subtle不可用 - 需要HTTPS环境'
    };
  },

  // 生成诊断报告
  generateReport() {
    const env = this.checkEnvironment();
    let report = '🏥 登录问题诊断报告\n\n';
    
    // 环境检查
    report += `📍 环境信息:\n`;
    report += `- URL: ${window.location.href}\n`;
    report += `- 协议: ${env.protocol} ${env.isSecure ? '✅' : '❌需要HTTPS'}\n`;
    report += `- 域名: ${env.hostname} ${env.isLocalhost ? '(localhost)' : ''}\n\n`;
    
    // localStorage检查
    report += `💾 存储检查:\n`;
    report += `- localStorage: ${env.localStorage.available ? '✅可用' : '❌不可用'}\n`;
    if (!env.localStorage.available) {
      report += `  错误: ${env.localStorage.error}\n`;
    }
    report += `\n`;
    
    // 加密检查
    report += `🔐 加密检查:\n`;
    report += `- crypto.subtle: ${env.cryptoSubtle.available ? '✅可用' : '❌不可用'}\n`;
    if (!env.cryptoSubtle.available) {
      report += `  错误: ${env.cryptoSubtle.error}\n`;
    }
    report += `\n`;
    
    // 建议
    report += `💡 修复建议:\n`;
    if (!env.isSecure && !env.isLocalhost) {
      report += `- ⚠️ 部署到HTTPS环境\n`;
    }
    if (!env.localStorage.available) {
      report += `- ⚠️ 检查浏览器隐私设置\n`;
      report += `- ⚠️ 清除浏览器缓存和Cookie\n`;
    }
    if (!env.cryptoSubtle.available) {
      report += `- ⚠️ 确保在HTTPS或localhost下访问\n`;
    }
    
    console.log(report);
    return report;
  }
};

// 自动诊断（开发模式下）
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 自动运行环境诊断...');
  setTimeout(() => diagnostics.generateReport(), 1000);
}