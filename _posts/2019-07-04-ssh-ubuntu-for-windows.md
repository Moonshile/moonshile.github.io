---
layout: post
title:  "ssh to ubuntu for windows"
date:   2019-07-04 21:06:27 +0800
categories: blog
---

```
sudo apt-get remove --purge openssh-server
sudo apt-get install openssh-server
# Change Port from 22 to 2222
sudo vi /etc/ssh/sshd_config
sudo service ssh --full-restart
```

>Just in case MS-Windows is using port 22; which, by the way, SSH on MS-Windows can be disabled if you want to use port 22

Ref: [How can I SSH into “Bash on Ubuntu on Windows 10”?](https://superuser.com/questions/1111591/how-can-i-ssh-into-bash-on-ubuntu-on-windows-10/)