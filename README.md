# weeWPress
一个基于 WordPress 接口开发的小程序

# 前提要素
## WordPress 版本
WordPress 版本要求 4.7+

## 安装认证插件
后台插件页面搜索：`JWT Authentication for WP REST API`
[插件页面地址](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

## 接口认证
修改 `/wp-config.php`，加密串生成地址：[https://api.wordpress.org/secret-key/1.1/salt/](https://api.wordpress.org/secret-key/1.1/salt/)

搜索 `define('NONCE_SALT',` (大约71行)，下方插入 `JWT_AUTH_SECRET_KEY` 和 `JWT_AUTH_CORS_ENABLE`
如示例：
```
define('JWT_AUTH_SECRET_KEY', '随机64位大小写+数字的加密串');

define('JWT_AUTH_CORS_ENABLE', true);
```

## 定制修改
在主题 `function.php` 文件最后一行插入下方代码，代码主要作用为优化接口数据
```php
// 定制化 WP-JSON 输出字段 - www.darlang.com
function customizer_rest_api($data, $post, $context)
{
    $_data = $data->data;

    // 移除模板字段
    unset( $_data['template'] );

    // 添加封面图字段
    $_data['featured_media_url'] = null;
    $featured_media = wp_get_attachment_image_src( $_data['featured_media'], 'original' );
    if( $featured_media ) $_data['featured_media_url'] = $featured_media[0];

    // 添加作者名称字段
    $_data['author_name'] = get_the_author_meta("nickname", $post->post_author);

    // 添加作者头像字段
    $_data['author_avatar'] = get_avatar_url(get_the_author_meta("user_email", $post->post_author));

    // 添加分类字段
    $_data['categories'] = wp_get_post_terms($_data['id'], 'category');

    // 添加标签字段
    $_data['tags'] = wp_get_post_tags($_data['id'] , 'post_tag');

    // 添加浏览数字段
    $_data['views'] = 0;
    $views = get_post_meta( $post->ID, 'views' )[0];
    if ($views) $_data['views'] = $views;

    $data->data = $_data;
    return $data;
}

add_filter( 'rest_prepare_post', 'customizer_rest_api', 10, 3); // 文章接口
add_filter( 'rest_prepare_page', 'customizer_rest_api', 10, 3); // 页面接口
```

## 其它问题

### 访问 `站点/wp-json` 提示404不存在
如果访问 xxx.com/wp-json/ 提示 404 ，页面不存在的时候，请留意你的固定链接是否为“朴素”类型。
查看修改：后台管理-设置-固定链接-改为非朴素选项




