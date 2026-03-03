# 独立部署指南

## 概述

这个应用可以完全作为**纯静态网站**部署，数据存储在浏览器本地（localStorage），不依赖任何后端服务器。

## 部署前准备

### 步骤 1：修改页面标题

打开 `client/index.html`，将标题改为你喜欢的名字：

```html
<title>健康打卡</title>
```

### 步骤 2：确保使用本地存储

确认 `client/src/pages/CheckinPage/CheckinPage.tsx` 中导入的是 local API：

```typescript
// 应该是这行（本地存储版本）
import { getCheckins, createCheckin, deleteCheckin, getAllWeightRecords, exportData, importData } from '@client/src/api/local';

// 而不是这行（服务器版本）
// import { getCheckins, createCheckin, deleteCheckin, getAllWeightRecords } from '@client/src/api';
```

## 推荐部署平台

### 方案一：Vercel（推荐 ⭐）

**优点：**
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速
- 绑定个人 GitHub 账号，永久可用

**部署步骤：**

1. **Fork 或下载代码到 GitHub**
   - 访问 https://github.com/new 创建新仓库
   - 上传代码到该仓库

2. **注册 Vercel**
   - 访问 https://vercel.com
   - 用 GitHub 账号登录

3. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 框架预设选择 "Other"
   - 构建命令：`npm run build:client`
   - 输出目录：`dist/client`
   - 点击 "Deploy"

4. **完成！**
   - 获得一个永久可用的链接（如：https://health-checkin-xxx.vercel.app）
   - 可以绑定自己的域名（可选）

### 方案二：直接下载静态文件部署

如果你不想用 GitHub，可以直接构建后上传：

1. **在本地构建**
   ```bash
   npm install
   npm run build:client
   ```

2. **获取构建产物**
   - 构建完成后，`dist/client` 目录包含所有静态文件

3. **上传到任何静态托管平台**
   - Cloudflare Pages
   - Netlify
   - 腾讯云 COS
   - 阿里云 OSS
   - 甚至你自己的服务器

### 方案三：GitHub Pages（免费但国内访问慢）

1. **Fork 代码到 GitHub**

2. **修改 GitHub Pages 配置**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"

3. **创建部署工作流**
   创建 `.github/workflows/deploy.yml` 文件

## 数据迁移说明

**重要：** 部署新地址后，原飞书链接中的数据**不会自动迁移**。

### 迁移步骤：

1. **在原飞书链接中备份数据**
   - 打开飞书内的应用
   - 滚动到底部「数据管理」
   - 点击「备份数据」→ 复制代码
   - 保存到微信收藏或备忘录

2. **在新部署的地址恢复数据**
   - 打开新的链接
   - 滚动到底部「数据管理」
   - 点击「恢复数据」→ 粘贴备份代码

## 注意事项

1. **数据独立性**
   - 每个网址都有独立的存储空间
   - 飞书链接的数据和新链接的数据是分开的
   - 请确保在废弃旧链接前已完成数据备份

2. **长期保存**
   - 建议每月备份一次数据
   - 将备份代码保存到多个地方（微信收藏、备忘录、邮件等）

3. **离线使用**
   - 部署后，应用依然支持离线使用
   - 添加为手机桌面图标后体验接近原生 App

4. **安全性**
   - 数据只存在你的设备上
   - 即使部署到公网，别人也无法看到你的数据
   - 备份代码请妥善保管

## 需要帮助？

如需帮助部署，可以：
1. 将代码上传到你的 GitHub 并提供仓库链接
2. 我可以协助配置 Vercel 自动部署

## 一键部署按钮

如果你想让别人也能一键部署，可以在 README 添加：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
