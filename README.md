# 凯强的百草园 — 博客搭建方案

> 悟已往之不谏 知来者之可追

## 一、技术栈总览

| 层次 | 选型 | 说明 |
|---|---|---|
| 框架 | **Astro 6.x** | 岛屿架构，默认零 JS，内容优先 |
| 托管 | **GitHub Pages** | `moonshile.github.io`，免费 |
| CI/CD | **GitHub Actions** | push 即构建部署 |
| 搜索 | **Pagefind** | 构建时生成索引，纯静态运行，支持中文，~50KB |
| 评论 | **Giscus** | 基于 GitHub Discussions，免费，支持 Markdown |
| 访问统计 | **Cloudflare Web Analytics** | 无 cookie，隐私友好，无限量 |
| 数学公式 | **KaTeX** (remark-math + rehype-katex) | 替代旧版 MathJax，渲染更快 |
| 广告 | **Google AdSense** | 岛屿组件按需加载 |
| LLM 优化 | **llms.txt** + Schema.org JSON-LD | 供 AI 爬虫索引 |
| 总成本 | **0 元** | 使用 `moonshile.github.io` 域名 |

## 二、核心功能

### 2.1 内容管理
- Markdown 编写，Astro Content Collections 管理
- Zod schema 校验 front matter（标题、日期、标签、作者等）
- 支持 MDX（Markdown 中嵌入交互组件）

### 2.2 标签系统
- Content Collections 内置 tags 支持
- 自动生成标签列表页 `/tags/` 和每个标签的文章列表 `/tags/[tag]/`

### 2.3 全文搜索
- Pagefind 在构建时自动索引全站内容
- 前端搜索组件以 Astro 岛屿加载，不影响其他页面性能

### 2.4 评论系统
- Giscus 以 Astro 岛屿组件挂载，仅在文章页加载
- 数据存储在 GitHub Discussions，无需额外后端

### 2.5 访问统计 & 加载耗时
- Cloudflare Web Analytics：一行 JS 脚本嵌入
- 页面加载耗时：浏览器 `Performance API` 内联 JS 显示

### 2.6 SEO & LLM 优化
- 自动生成 sitemap、RSS feed
- Open Graph / Twitter Card meta 标签
- Schema.org JSON-LD 结构化数据（BlogPosting）
- `/llms.txt` 和 `/llms-full.txt` 供 AI 搜索引擎索引

### 2.7 多端编辑
- 源文件存 GitHub，push 后自动发布
- 手机：GitHub App / Working Copy 编辑 Markdown
- 电脑：任意编辑器

## 三、目录结构设计

```
moonshile.github.io/
├── src/
│   ├── content/
│   │   └── posts/              # Markdown 博文
│   │       ├── 2019-07-03-config-gitpages-jekyll.md
│   │       ├── 2019-07-24-bp-algo.md
│   │       └── ...
│   ├── layouts/
│   │   └── PostLayout.astro    # 文章布局（标题、日期、标签、评论）
│   ├── pages/
│   │   ├── index.astro         # 首页（文章列表）
│   │   ├── about.astro         # 关于页
│   │   ├── tags/
│   │   │   ├── index.astro     # 标签云
│   │   │   └── [tag].astro     # 单标签文章列表
│   │   ├── posts/
│   │   │   └── [...slug].astro # 文章详情页
│   │   ├── llms.txt.ts         # LLM 索引
│   │   └── 404.astro
│   ├── components/
│   │   ├── Search.astro        # Pagefind 搜索岛屿
│   │   ├── Comments.astro      # Giscus 评论岛屿
│   │   ├── LoadTime.astro      # 加载耗时显示
│   │   ├── Analytics.astro     # Cloudflare Analytics
│   │   └── AdSense.astro       # 广告组件
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   │   └── post/               # 博文图片资源
│   └── contrib/                # 第三方静态资源
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions 部署
```

## 四、数据迁移方案

### 4.1 迁移范围

现有 Jekyll 博客包含以下需迁移的内容：

| 类型 | 数量 | 说明 |
|---|---|---|
| 博文 | 5 篇 | 2019 年，中英双语 |
| 图片资源 | 2 张 | `assets/post/forward.png`, `backward.png` |
| 自定义 JS/CSS | 1 组 | `conv_visual.js/css`（CNN 文章的卷积可视化） |
| 数学公式 | 2 篇 | BP-Algo（35 处）、CNN（15 处）使用 `$$...$$` LaTeX |

### 4.2 Front Matter 转换

Jekyll 格式：
```yaml
---
layout: post
title:  "反向传播(BP)算法的推导"
date:   2019-07-24 20:22:52+0800
categories: 深度学习 反向传播
author: Kaiqiang Duan
---
```

Astro 格式：
```yaml
---
title: "反向传播(BP)算法的推导"
date: 2019-07-24
tags: ["深度学习", "反向传播"]
author: "Kaiqiang Duan"
description: "神经网络反向传播算法的数学推导"
---
```

**转换规则**：
- 移除 `layout` — 由 Astro Content Collections 统一管理
- `categories` → `tags` — 语义更明确，改为数组格式
- `date` — 简化为 `YYYY-MM-DD`，时区由 Astro 配置统一处理
- 新增 `description` — 用于 SEO 和文章列表摘要

### 4.3 数学公式迁移

- 现有博文使用 `$$...$$` 语法（MathJax）
- Astro 中通过 `remark-math` + `rehype-katex` 插件原生支持，**语法完全兼容**，无需修改正文
- KaTeX 渲染速度比 MathJax 快约 100 倍，且体积更小

### 4.4 图片路径迁移

| 原路径 | 新路径 |
|---|---|
| `/assets/post/forward.png` | `/images/post/forward.png` |
| `/assets/post/backward.png` | `/images/post/backward.png` |

博文中的引用路径需同步更新：
```diff
- [forward]: /assets/post/forward.png
+ [forward]: /images/post/forward.png
```

### 4.5 自定义 JS/CSS 迁移（CNN 文章卷积可视化）

CNN 文章中内嵌了 `conv_visual.js` 和 `conv_visual.css`，两种迁移方式：

- **方案 A（推荐）**：将该文章转为 MDX，卷积可视化封装为 Astro 岛屿组件 `<ConvVisual client:visible />`，仅在该文章中按需加载
- **方案 B**：保持 JS/CSS 放在 `public/contrib/` 下作为静态资源，在文章 layout 中条件加载

### 4.6 URL 兼容（可选）

旧 URL 格式：`/2019/07/24/BP-Algo.html`
新 URL 格式：`/posts/bp-algo/`（Astro 默认 slug）

如需保持旧 URL 可访问，可通过以下方式：
- Astro 的 `getStaticPaths()` 生成旧路径重定向
- 或在 `public/_redirects` 中配置（Cloudflare Pages 支持）
- 由于原博客流量较小且年代久远，**建议不做旧 URL 兼容**，直接使用新 URL

### 4.7 迁移清单

- [ ] 初始化 Astro 项目，配置 Content Collections schema
- [ ] 迁移 5 篇博文，转换 front matter
- [ ] 迁移图片资源到 `public/images/post/`
- [ ] 更新博文中的图片引用路径
- [ ] 配置 remark-math + rehype-katex，验证数学公式渲染
- [ ] 将 CNN 文章卷积可视化封装为 Astro 组件（或 MDX）
- [ ] 配置 GitHub Actions 部署到 GitHub Pages
- [ ] 集成 Pagefind 搜索
- [ ] 集成 Giscus 评论
- [ ] 集成 Cloudflare Web Analytics
- [ ] 添加加载耗时显示
- [ ] 生成 llms.txt
- [ ] SEO 优化（sitemap、RSS、Open Graph、JSON-LD）
- [ ] 预留 AdSense 广告位

## 五、实施阶段

### Phase 1：基础搭建
初始化 Astro 项目，完成基本布局（首页、文章页、关于页、标签页），迁移全部 5 篇博文及资源，配置数学公式渲染，部署到 GitHub Pages。

### Phase 2：功能集成
集成 Pagefind 搜索、Giscus 评论、Cloudflare Web Analytics、加载耗时显示。

### Phase 3：优化增强
SEO 优化、llms.txt 生成、AdSense 广告位、样式美化调优。
