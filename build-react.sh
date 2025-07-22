#!/bin/bash

echo "=== React版本运行和打包指南 ==="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装Node.js，请先安装: https://nodejs.org/"
    exit 1
fi

echo "Node.js版本: $(node -v)"
echo "NPM版本: $(npm -v)"

# 检查是否在React目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在React项目目录中运行此脚本"
    echo "cd /Users/lubenwei/Desktop/food/food-therapy-react"
    exit 1
fi

echo ""
echo "=== 可用命令 ==="
echo ""
echo "🚀 开发运行:"
echo "   npm start          # 启动开发服务器 (http://localhost:3000)"
echo "   npm run dev        # 同上"
echo ""
echo "📦 生产打包:"
echo "   npm run build      # 打包到build/目录"
echo ""
echo "🧪 运行测试:"
echo "   npm test           # 运行测试"
echo ""
echo "⚙️ 高级配置:"
echo "   npm run eject      # 暴露配置文件 (不可逆!)"

echo ""
echo "=== 部署方法 ==="
echo ""
echo "1. 打包后部署:"
echo "   npm run build"
echo "   # 将build/目录内容部署到服务器"
echo ""
echo "2. 本地预览:"
echo "   npm install -g serve"
echo "   serve -s build"
echo ""
echo "3. Docker部署:"
echo "   # 创建Dockerfile后:"
echo "   docker build -t food-therapy ."
echo "   docker run -p 80:80 food-therapy"

# 创建Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 创建nginx配置
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # 处理React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

echo ""
echo "✅ 已创建部署文件:"
echo "   - Dockerfile"
echo "   - nginx.conf"
echo ""
echo "立即开始开发: npm start"