# 使用官方 Node.js 镜像作为基础镜像
FROM node:20

# 创建并设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有的话）
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目的所有文件到工作目录
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 运行 Next.js 应用
CMD ["npm", "start"]

# 暴露应用运行的端口
EXPOSE 3000
