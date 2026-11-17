# 示例手记 · 个人作品展示站模板

一个**纯静态**的个人作品集 / 简历站模板：HTML + CSS + 原生 JS，**没有构建步骤、没有依赖、不需要 npm**。
双击 `index.html` 就能看效果，也可以直接丢到 GitHub Pages、Vercel、阿里云 OSS、宝塔面板上。

- 响应式（手机抽屉菜单、单列布局）
- 深色模式（跟随系统 + 手动切换，localStorage 记忆）
- 作品画廊（大图 + 缩略图条 + 全屏灯箱 + 键盘方向键）
- 简历页按设备切换：电脑内嵌 PDF 预览，手机/预览失败自动换成网页版简历
- 笔记板块：写 Markdown，跑一个脚本生成列表页和文章页
- 全站只改一份样式表、一份脚本

> 站内所有姓名、学校、公司、赛事、邮箱、域名都是**占位内容**，请替换成你自己的。
> 在线 Demo：<https://l-y-max.github.io/personal-site-template/>

---

## 预览

**首页**（桌面）

![首页预览](preview/home.jpg)

**项目详情页**（桌面，带侧边目录与截图画廊）

![项目详情页预览](preview/detail.jpg)

**手机端**

| 首页 | 简历（网页版，PDF 打不开时自动切换） |
|:---:|:---:|
| <img src="preview/mobile-home.jpg" width="320" alt="手机首页"> | <img src="preview/mobile-resume.jpg" width="320" alt="手机简历"> |

> 屏幕变宽时自动切三栏，变窄时收成单列并换成抽屉菜单；右上角可以手动切换深色模式。

---

## 快速开始

```bash
# 1. 克隆或下载本仓库
# 2. 直接打开 index.html 预览（无需任何工具）
# 3. 按下面的清单替换内容，再推到你自己的仓库
```

**5 分钟换成自己的**，按这个顺序改：

| 顺序 | 改什么 | 在哪 |
|---|---|---|
| 1 | 姓名 / 昵称 / 邮箱 / GitHub | 全站搜索 `小可`、`Demo`、`hello@example.com`、`your-github` |
| 2 | 学校、公司、项目、赛事 | 搜索 `某某大学`、`某某银行`、`示例项目`、`学科竞赛` |
| 3 | 域名 | 搜索 `example.com`（`sitemap.xml`、`robots.txt`、各页 canonical / og:url） |
| 4 | 图片 | 见下面的「要替换的图片清单」，`img/` 里目前全是占位图 |
| 5 | 简历 PDF | 用你自己的 PDF 覆盖 `resume.pdf`（模板里是 0 字节空文件） |

> 一次性改完再上传，避免线上出现半成品。

---

## 0. 免责与许可

- 代码以 **MIT License** 开源（见 `LICENSE`），可商用、可修改、可二次分发，保留版权声明即可。
- `img/`、`resume.pdf` 里的占位图由本项目生成，可自由替换。
- 请勿把本模板直接当成自己的个人站上线而不改文案——搜索引擎会判定为重复内容。

---

## 1. 目录结构

```
个人网站/
├─ index.html          首页（首屏 / 数据 / 项目 / 荣誉技能 / 关于 / 时间轴 / 联系）
├─ about.html          详细介绍
├─ detail.html         项目案例：示例项目（带侧边目录）
├─ resume.html         简历预览（电脑内嵌 PDF，手机显示网页版）
├─ 404.html            404 页（需要服务器配置才能生效）
├─ css/main.css        ★ 全站唯一样式表：颜色变量、组件、响应式、深色模式
├─ js/main.js          ★ 全站唯一脚本：主题切换、菜单、动画、灯箱、复制
├─ img/                所有图片（当前为占位图）

├─ notes/              ★ 笔记：写 .md，跑脚本生成 .html
│   ├─ index.html      笔记列表（自动生成）
│   └─ 2026-11-14-xxx.md / .html
├─ resume.pdf          简历 PDF
├─ favicon.ico         浏览器标签图标（内含 16/32/48）
├─ site.webmanifest    PWA 应用信息（名称、主题色、图标）
├─ robots.txt          搜索引擎抓取规则
├─ sitemap.xml         站点地图
└─ _backup/            ★ 部署时不要上传这个文件夹
```

**只有 4 个文件需要维护**：`css/main.css`、`js/main.js`、`index.html` 和几张图片。
新增页面时，复制任意一个页面，改掉 `<title>` / 描述 / 正文即可，导航和页脚是同一份 markup。

---

## 2. 改颜色：只改 main.css 顶部的 `:root`

```css
--brand-500:#9368D9;   /* 你原来的主色（现在只用于装饰和渐变） */
--brand-600:#7C4DDB;   /* 新主色：按钮、链接、标题强调，白字对比度 5.7:1 */
--pink-500:#EC4899;    /* 辅助色，只出现在渐变里 */
--accent:var(--brand-600);   /* 组件真正用的是这个别名 */
```

想换整套配色，改 `--brand-*` 六个色阶 + `--accent/--on-accent` 四个别名就行，
全站四个页面、深色模式、按钮、标签、渐变会一起变。

深色模式在 `[data-theme="dark"]` 里单独覆盖，不需要改组件。

---

## 3. 要替换的图片清单

| 文件 | 用在哪 | 建议尺寸 | 现状 |
|---|---|---|---|
| `img/avatar.jpg` | 首页首屏 + 关于我 | 800×1066，< 150 KB | ✅ 由 `avater.jpg` 生成（102 KB） |
| `img/avatar.webp` | 同上（优先加载） | 同尺寸 | ✅ 57 KB |
| `img/zhiyin.png` | 项目主图 / 手机壳里 | 632×1400 | ✅ 已有 |
| `img/cert1~3.jpg` | 荣誉证书缩略图 | 4:3，≥ 900px 宽 | ⚠️ 现在是占位图，换成真证书 |
| `img/shot-1~3.jpg` | 项目详情页界面截图 | 4:3，≥ 900px 宽 | ⚠️ 现在是占位图 |
| `img/apple-touch-icon.png` | iOS「添加到主屏幕」 | 180×180 | ✅ 手绘头像，满版方形（iOS 自己加圆角） |
| `img/brand-mark.png` | 导航栏 / 页脚左上角的品牌标 | 144×144 | ✅ 头像脸部特写，CSS 负责圆角 |
| `img/favicon-32.png` / `favicon-16.png` | 浏览器标签页 | 32/16 | ✅ 圆角版头像 |
| `favicon.ico` | 根目录，浏览器默认请求 | 16/32/48 | ✅ 内含三档 |
| `img/icon-192.png` / `icon-512.png` | Android / PWA | 192/512 | ✅ |
| `img/icon-maskable-512.png` | Android 自适应图标 | 512 | ✅ 四边溢出，圆形遮罩不会露直角 |
| `img/og-cover.jpg` | 微信/QQ 分享卡片 | 1200×630 | ✅ 已生成，改名字/介绍后可重跑脚本 |
| `img/favicon.svg` | 字母 C 版标签图标（备用） | 矢量 | 目前未引用，想换回字母标就把 `<link rel="icon">` 指到它 |
| `site.webmanifest` | PWA 应用信息 | — | ✅ 名字、主题色、图标 |
| `resume.pdf` | 简历下载 / 预览 | A4 | ⚠️ 现在是占位 PDF，换成你的 |

**占位图不用删，直接用同名文件覆盖即可**，页面会自动换成新图。

### 图标是整套一起生成的

所有图标都来自 `img/apple-touch-icon.jpg`（手绘头像原图，1280×1280）。
想换头像或调整裁切/背景，改 `_tools/make_icons.py` 顶部的 `ZOOM` / `BG_TOP` / `BG_BOTTOM` 后运行：

```bash
python _tools/make_icons.py
```

一次性重生成 180/192/512/自适应/32/16/ico 全部尺寸，避免手改漏掉某个平台。

> 换了姓名或标语之后想重新生成分享图，运行一次：
> `python _tools/gen_assets.py`（需要 Pillow，它不会再覆盖图标）

---

## 4. 常见修改位置

- **首屏文案**：`index.html` 里搜 `hero__title` / `hero__desc`
- **职业轮播词**：搜 `data-rotator`，改方括号里的 JSON 数组
- **统计数据**：搜 `data-count`，改数字和后面的 `<span class="suffix">`
- **项目卡片**：搜 `<!-- 项目一 -->` / `<!-- 项目二 -->`
- **时间轴**：搜 `class="tl"`，每个 `.tl` 是一条
- **邮箱**：全站搜 `xxx@xxx.com` 统一替换（同时改 `data-copy` 和 `mailto:`）
- **GitHub**：全站搜 `https://github.com/` 补上你的用户名
- **ICP 备案号**：`footer__bottom` 里加一行即可（见第 6 节）

---

## 5. 已经内置的交互

| 功能 | 说明 |
|---|---|
| 深色模式 | 右上角按钮切换，跟随系统偏好，记住选择（localStorage） |
| 移动端菜单 | ≤ 900px 自动变汉堡菜单，支持 Esc 关闭、点外部关闭 |
| 滚动进场 | 列表/卡片逐块淡入；**JS 失效时自动全量显示，不会白屏** |
| 数字滚动 | 数据条进入视口时从 0 滚到目标值 |
| 界面截图画廊 | 页面里直接就是大图 + 左右箭头 + 缩略图条 + 页码，点缩略图切换；点大图进全屏查看器，电脑上 ←/→ 翻页、Esc 关闭，手机上左右滑动 |
| 图片查看器 | 证书和截图共用，全屏显示、带缩略图条与页码 |
| 阅读进度条 | 顶部 2px 渐变线 |
| 复制邮箱 | 点一下写进剪贴板，右下角弹提示 |
| 回到顶部 | 滚过 600px 后出现 |
| 打印样式 | 简历页点「打印本页」会隐藏导航/页脚，只留正文 |
| 简历按设备切换 | 电脑显示 PDF 内嵌预览；手机（UA 判断）自动换成网页版简历 + 「用阅读器打开 PDF」，避免手机浏览器内嵌 PDF 白屏 |

---

## 6. 部署到阿里云 / 宝塔

1. 把 **除 `_backup/` 以外** 的文件全部上传到站点根目录；
2. Nginx 建议开 gzip（CSS/JS/HTML/SVG），图片/PDF 设长缓存：

```nginx
gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
location ~* \.(jpg|jpeg|png|webp|svg|pdf)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}
location ~* \.(css|js)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}
error_page 404 /404.html;
```

3. 证书：`certbot --nginx -d example.com -d www.example.com`
4. 备案号放在页脚（`footer__bottom`）：

```html
<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">鲁ICP备XXXXXXXX号</a>
```

5. 上线后到 [Google Search Console](https://search.google.com/search-console) 和
   [百度搜索资源平台](https://ziyuan.baidu.com/) 提交 `https://example.com/sitemap.xml`。

---

## 7. 注意

- `resume.html` 用 `<iframe>` 内嵌 PDF。Chrome / Edge 正常，**部分手机浏览器会显示空白**，
  页面里已经放了提示条，引导访客点「下载 PDF」。用 `file://` 双击打开时也可能不显示预览，
  想看效果请用本地服务器（例如 `python -m http.server 8000`）。
- 全站没有外链字体和 CDN，离线可用，加载只依赖本地文件。
- `_tools/` 是开发脚本（站点体检、图片生成、笔记构建），不需要上传服务器。

---

## 8. 写笔记

笔记是 **Markdown 驱动**的：你只写 `.md`，跑一条命令，页面、列表、首页卡片、sitemap 全部自动更新。

### 新增一篇

1. 在 `notes/` 下新建 `YYYY-MM-DD-英文短名.md`，比如 `2026-11-20-django-orm.md`
2. 开头写 front matter：

```markdown
---
title: 标题会显示在页面和列表里
date: 2026-11-20
desc: 一句话摘要，会出现在笔记列表和首页卡片上
tags: 后端, Django
---

正文从这里开始……
```

3. 运行：

```bash
python _tools/build_notes.py
```

会输出：`notes/<同名>.html`、更新 `notes/index.html`、把最新 3 篇写进首页「最近在写」、重写 `sitemap.xml`。

### 支持的语法

标题（`##` / `###`）、段落、**粗体**、*斜体*、`行内代码`、代码块（```` ```nginx ````）、
有序/无序列表、`- [ ]` 复选框、引用 `>`、分割线 `---`、链接、图片。

中文段落里的硬换行会自动合并（不会在中文之间塞空格），所以你放心折行。

### 图片

放在 `notes/img/` 下，正文里写 `![说明](img/xxx.png)`（相对于 notes 目录）。
图片建议先压到 200 KB 以内。

### 注意

- 文件名以 `_` 开头的 md 会被跳过（可以拿来做草稿）。
- **不要直接改 `notes/*.html`**，下次构建会被覆盖；要改就改 `.md`。

---

## 9. 开启访问统计

现在**默认一个统计脚本都不加载**，页面不会向任何第三方发请求。
埋点已经全部写好，你只需要在 `js/analytics.js` 顶部改三行。

### 方案 A：百度统计（推荐，免费、国内快、不用服务器）

1. 打开 https://tongji.baidu.com/ 新建站点，拿到代码里 `hm.js?id=` 后面那串
2. 打开 `js/analytics.js`，改：

```js
provider: 'baidu',
baiduId: '你的那串ID',
```

### 方案 B：Umami（隐私友好，可用你的阿里云 ECS 自建）

```bash
docker run -d --name umami -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/umami \
  ghcr.io/umami-software/umami:postgresql-latest
```

后台添加网站后，把跟踪脚本的地址和 ID 填进去：

```js
provider: 'umami',
umamiSrc: 'https://analytics.example.com/script.js',
umamiId: '你的 data-website-id',
```

### 已经埋好的事件

| 事件名 | 什么时候触发 | 看什么 |
|---|---|---|
| `resume-download` | 点任意「下载简历 / 下载 PDF」 | **简历被下载了几次**，这是最有价值的指标 |
| `copy-email` | 点「复制邮箱」 | 有多少人想联系你 |
| `email-click` | 点「发送邮件」 | 同上 |
| `github` | 点 GitHub 图标/链接 | 有多少人去看代码 |
| `note-view` | 点开某篇笔记 | 哪篇文章最受欢迎 |

想给别的按钮加统计，只要在 HTML 上加一个属性：

```html
<a href="..." data-track="自定义事件名">按钮</a>
```

### 自测

把 `js/analytics.js` 里的 `debug: true` 打开，点按钮时控制台会打印 `[track] 事件名 {...}`，
确认埋点没问题后再改回 `false` 并配置正式 ID。

### 隐私

百度统计会用 cookie。国内访问没有强制同意弹窗，但如果你在意，可以在页脚加一句
「本站使用百度统计，仅收集访问量与页面点击，不涉及个人身份信息」。

---

## 10. 注意（补充）

- 笔记页面的相对路径前缀是 `../`，由构建脚本自动处理，你不用管。
- 想改笔记的版式（标题字号、代码块配色），改 `css/main.css` 里的 `.prose` 一组样式，
  四个页面的正文和笔记会一起变。
