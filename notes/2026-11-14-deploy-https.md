---
title: 小程序后端上线：从 ECS 到 HTTPS 的完整清单
date: 2026-11-14
desc: 备案、Nginx、证书、合法域名——跟着项目完整走了一遍上线流程，真正卡人的从来不是代码。
tags: 部署, Nginx, 小程序
---

《示例项目》上线那阵子，我从头跟了一遍后端从本地 `runserver` 搬到阿里云的过程。
我以为最难的是代码，结果真正耗时间的全是备案、证书和端口这类事。

这篇把当时走过的顺序整理成清单，给以后要用的人（包括我自己）省点时间。

## 一、先备案，再谈上线

域名解析到服务器之前，先确认两件事：

- 域名已完成 **ICP 备案**，并且备案主体和网站名称与实际一致；
- 备案通过后，页面底部要挂备案号并链接到工信部，这一步别拖。

没备案的域名，八十端口能开，但小程序后台根本加不进去——不是报错的问题，是前置条件不成立。

## 二、Nginx 反向代理

Django 的 `runserver` 只能用来开发。线上让它跑在 `127.0.0.1:8000`，外面用 Nginx 接：

```nginx
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    client_max_body_size 12m;

    location /static/ {
        alias /srv/app/static/;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

几个容易漏的点：

1. 没有 `X-Forwarded-Proto`，Django 会以为自己在跑 HTTP，重定向会绕圈；
2. 上传接口要放 `client_max_body_size`，默认 1 MB 传个头像就 413；
3. 静态文件交给 Nginx，不要让 Django 去处理。

## 三、证书

用 Let's Encrypt 最省事：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.example.com
sudo certbot renew --dry-run
```

`renew --dry-run` 一定要跑一遍，不然三个月后证书过期才发现就晚了。

## 四、小程序后台的合法域名

微信要求请求域名必须是 **HTTPS** 且在后台白名单里，`request` 和 `uploadFile` 的域名要分别配置。

改域名之后记得重新编译小程序，开发者工具会缓存旧配置。

## 五、上线前检查清单

- [ ] `DEBUG = False`，`ALLOWED_HOSTS` 填了正式域名
- [ ] 数据库密码、密钥都在环境变量里，不在代码里
- [ ] 静态文件已 `collectstatic`
- [ ] 80 端口能 301 到 443，证书链完整
- [ ] 接口带上错误码，前端能区分「未登录」和「无权限」
- [ ] 有日志，并且能按时间查到请求

上线这件事，代码只是其中一环。把这套流程走顺一次之后，后面换服务器就只是机械劳动了。
