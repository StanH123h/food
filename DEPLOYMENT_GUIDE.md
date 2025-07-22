# 🚀 食疗平台部署指南

## 登录问题解决方案

### ⚠️ 常见问题
你遇到的**本地可以登录，部署后不行**的问题，通常由以下原因导致：

1. **crypto.subtle API限制** - 只在HTTPS或localhost下可用
2. **localStorage权限问题** - 某些部署环境限制存储
3. **域名差异** - 本地和生产环境存储隔离
4. **浏览器安全策略** - 跨域或混合内容阻止

### 🛠️ 已修复的问题

✅ **crypto.subtle降级方案** - 自动检测并使用兼容的哈希函数
✅ **localStorage故障处理** - 自动降级到内存存储
✅ **环境诊断工具** - 自动检测并报告问题

### 📋 部署前检查清单

#### 1. HTTPS配置 (必须!)
```bash
# 检查你的部署是否支持HTTPS
curl -I https://your-domain.com

# 如果不支持，需要配置SSL证书
# 推荐使用 Let's Encrypt 免费证书
```

#### 2. 服务器配置

**Nginx配置示例:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # React路由支持
    location / {
        root /var/www/build;
        try_files $uri $uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;
}

# HTTP到HTTPS重定向
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### 3. 构建和部署

```bash
# 1. 构建生产版本
npm run build

# 2. 测试构建结果
npx serve -s build

# 3. 部署到服务器
# 方法A: 直接上传build文件夹
scp -r build/* user@server:/var/www/html/

# 方法B: 使用Docker
docker build -t food-therapy .
docker run -p 443:443 food-therapy
```

### 🔧 故障排除

#### 问题1: 登录失败但无错误信息
**原因**: crypto.subtle不可用  
**解决**: 确保HTTPS部署，检查控制台警告信息

#### 问题2: 数据不能保存
**原因**: localStorage被禁用  
**解决**: 已自动降级到内存存储，用户需要重新登录

#### 问题3: 摄像头无法访问  
**原因**: 非安全环境  
**解决**: 必须使用HTTPS

### 🏥 诊断工具使用

在浏览器控制台运行:
```javascript
// 检查环境
window.diagnostics?.checkEnvironment();

// 生成完整报告
window.diagnostics?.generateReport();
```

### 🌐 推荐部署平台

#### 免费选项:
- **Vercel** - 自动HTTPS，React友好
- **Netlify** - 简单部署，免费SSL
- **GitHub Pages** - 支持自定义域名

#### 付费选项:
- **AWS S3 + CloudFront** - 高性能CDN
- **阿里云OSS** - 国内访问速度快

### 📊 部署后验证

访问你的网站并检查:
1. ✅ 地址栏显示🔒图标（HTTPS）
2. ✅ 控制台无crypto.subtle警告
3. ✅ 能够正常注册和登录
4. ✅ 摄像头权限请求正常弹出
5. ✅ 数据能够正常保存

### 🆘 紧急处理

如果仍然无法登录，在生产环境控制台运行:

```javascript
// 强制重置
localStorage.clear();
sessionStorage.clear();
location.reload();

// 检查存储状态
console.log('当前用户:', localStorage.getItem('loggedInUser'));
console.log('管理员数据:', localStorage.getItem('user_swh'));
```

### 📞 技术支持

遇到问题时，请提供：
1. 部署URL
2. 浏览器版本
3. 控制台错误截图  
4. 诊断工具报告结果

---

**记住：摄像头和crypto.subtle功能必须在HTTPS环境下工作！**