# weeWPress
一个基于 WordPress 接口开发的小程序

# 前提要素

## 安装插件 JWT Authentication for WP REST API
==> [插件页面地址](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

## 修改 `/wp-config.php`

加密串生成地址：[https://api.wordpress.org/secret-key/1.1/salt/](https://api.wordpress.org/secret-key/1.1/salt/)
 
搜索 `define('NONCE_SALT',` (大约71行)，下方插入 `JWT_AUTH_SECRET_KEY` 和 `JWT_AUTH_CORS_ENABLE`

示例：
```
define('JWT_AUTH_SECRET_KEY', '随机64位大小写+数字的加密串');

define('JWT_AUTH_CORS_ENABLE', true);
```

## wp-json 404不存在
如果访问 xxx.com/wp-json/ 提示 404 ，页面不存在的时候，请留意你的固定链接是否为“朴素”类型。
查看修改：后台管理-设置-固定链接-改为非朴素选项




