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

## 四、功能清单

- [x] Astro 6.x + Content Collections
- [x] 数学公式渲染（remark-math + rehype-katex）
- [x] GitHub Actions 自动部署
- [x] Pagefind 全文搜索
- [x] Giscus 评论
- [x] Cloudflare Web Analytics
- [x] 页面加载耗时显示
- [x] llms.txt / llms-full.txt
- [x] SEO（sitemap、RSS、Open Graph、JSON-LD）
- [x] AdSense 广告位预留
