---
layout: post
title:  "Config Git Pages and Jekyll on Ubuntu 18.04 Windows App"
date:   2019-07-03 22:24:27 +0800
categories: gitpages jekyll
---

## 初始化配置

新建repo并且clone repo.

在repo的根目录下添加文件`Gemfile`.

```bash
source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins
gem 'jekyll-feed'
gem 'jekyll-seo-tag'
gem 'jekyll-redirect-from'
gem 'jekyll-include-cache'
gem 'minima'
```

安装ruby以及其他依赖

```bash
sudo apt-get update
sudo apt-get install ruby ruby-dev make g++ zlib1g-dev
gem install bundler
```

> `make`, `g++`, `zlib1g-dev`是运行`bundler install`安装的`Gemfile`列表中某些包的依赖项.

执行以下命令. 不要使用root用户执行, 如果需要root权限, 在命令运行过程中会请求.

```bash
bundle install
```

要初始化你的博客, 运行

```bash
bundle exec jekyll new <your site path>
```

+ 请确保运行该命令的环境中存在`Gemfile`.
+ 如果`<your site path>`非空, 并且你确信知道会发生什么, 可以加`-f`开关强制初始化.

初始化完成后, 运行以下命令就可以在浏览器中打开你的博客啦.

```bash
bundle exec jekyll serve
```

+ 如果你想在另一台机器上访问, 请加上开关`-H 0.0.0.0`
+ 如果你想使用其他端口, 请加上开关`-P <your port>`

## 模板修改
假设你使用了minima作为模板, 现在想自定义模板定义, 比如希望支持$$\LaTeX$$公式. 运行

```bash
bundle show minima
```

这时你可以看到minima模板的源代码路径以及文件目录组织结构.

```
├── LICENSE.txt
├── README.md
├── _includes
│   ├── disqus_comments.html
│   ├── footer.html
│   ├── google-analytics.html
│   ├── head.html
│   ├── header.html
│   ├── icon-github.html
│   ├── icon-github.svg
│   ├── icon-twitter.html
│   ├── icon-twitter.svg
│   └── social.html
├── _layouts
│   ├── default.html
│   ├── home.html
│   ├── page.html
│   └── post.html
├── _sass
│   ├── minima
│   │   ├── _base.scss
│   │   ├── _layout.scss
│   │   └── _syntax-highlighting.scss
│   └── minima.scss
└── assets
    ├── main.scss
    └── minima-social-icons.svg
```

查看`default.html`可以发现该文件包含了`head.html`, `header.html`和`footer.html`, 另外还渲染了`content`变量. 可见这是一个母版.

将`head.html`按照相同的目录结构复制到你的repo中, 并添加以下一行

```html
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
```

这样你的博客就支持$$\LaTeX$$公式了, 使用方式是`$$\LaTeX$$`. 同时, 你也完成了模板修改的一个案例.

## TSG

Jekyll默认使用UTC时间. 如果一篇post中的front matter中的date字段使用了UTC+0800时间但未标注, 有可能被系统作为未来的时间看待而导致post不能被显示出来. 解决方法

1. 在`_config.yml`中配置`future: true`
2. 更合适的方案是就直接在front matter中date字段的最后显式加上`+0800`, 如
	```
	date:   2019-07-03 22:24:27 +0800
	```

## 参考文献

[LaTeX in Jekyll](http://www.iangoodfellow.com/blog/jekyll/markdown/tex/2016/11/07/latex-in-markdown.html)
