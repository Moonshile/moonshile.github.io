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
