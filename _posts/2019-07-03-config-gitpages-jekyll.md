---
layout: post
title:  "Config Git Pages and Jekyll on Ubuntu 18.04 Windows App"
date:   2019-07-03 22:24:27 +0800
categories: blog
---

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

## TSG

Jekyll默认使用UTC时间. 如果一篇post中的front matter中的date字段使用了UTC+0800时间但未标注, 有可能被系统作为未来的时间看待而导致post不能被显示出来. 解决方法

1. 在`_config.yml`中配置`future: true`
2. 更合适的方案是就直接在front matter中date字段的最后显式加上`+0800`, 如
	```
	date:   2019-07-03 22:24:27 +0800
	```
