import {request, showToast} from './utils';

/**
 * 获取文章列表
 *
 * @author crl
 * @param  {Object} params                   请求参数
 * @param {string} params.context            默认: "view", 可选: "view","embed","edit"
 * @param {integer} params.page              默认: 1, 当前分页
 * @param {integer} params.per_page          默认: 10, 分页大小
 * @param {string} params.search             搜索内容
 * @param {string} params.after              指定日期之后的文章, 如: "2020.02.02"
 * @param {array} params.author              默认: [ ], 包含指定作者ID的文章, 如: [1, 2, 3]
 * @param {array} params.author_exclude      默认: [ ], 排除指定作者ID的文章, 如: [1, 2, 3]
 * @param {string} params.before             指定日期之前的文章, 如: "2020.02.02"
 * @param {array} params.exclude             默认: [ ], 包含指定文章ID的文章, 如: [1, 2, 3]
 * @param {array} params.include             默认: [ ], 排除指定文章ID的文章, 如: [1, 2, 3]
 * @param {integer} params.offset            结果偏移
 * @param {string} params.order              默认: "desc", 可选: "asc","desc"
 * @param {string} params.orderby            默认: "date", 可选: "author","date","id","include","modified","parent","relevance","slug","include_slugs","title"
 * @param {array} params.slug                include post slug, 如: ['post1', 'post2']
 * @param {array} params.status              默认: "publish", 可选: "publish","future","draft","pending","private","trash","auto-draft","inherit","request-pending","request-confirmed","request-failed","request-completed","any", 返回指定状态的文章, 如: ['publish', 'future']
 * @param {string} params.tax_relation       默认: "", 可选: "AND","OR"
 * @param {array} params.categories          默认: [ ], 包含指定分类ID的文章, 如: [1, 2, 3]
 * @param {array} params.categories_exclude  默认: [ ], 排除指定分类ID的文章, 如: [1, 2, 3]
 * @param {array} params.tags                默认: [ ], 包含指定标签ID的文章, 如: [1, 2, 3]
 * @param {array} params.tags_exclude        默认: [ ], 排除指定标签ID的文章, 如: [1, 2, 3]
 * @param {boolean} params.sticky            如果为 true, 返回置顶文章
 * @return {[type]}
 */
export function GetPosts(params={}) {
  return request('posts', 'get', params);
}

/**
 * 获取文章详情
 * @author crl
 * @param  {integer} id       文章ID
 * @param  {String} password  文章密码，如有
 * @param  {String} context   默认: "view", 可选: "view","embed","edit"
 */
export function GetPostsInfo(id, password='', context='') {
  return request('posts/'+id, 'get', {context, password});
}

/**
 * 获取分类列表
 *
 * @author crl
 * @param  {Object} params           请求参数
 * @param {string} params.context    默认: "view", 可选: "view","embed","edit"
 * @param {integer} params.page      默认: 1, 当前分页
 * @param {integer} params.per_page  默认: 10, 分页大小
 * @param {string} params.search     搜索内容
 * @param {array} params.exclude     默认: [ ], 包含指定目录ID的分类, 如: [1, 2, 3]
 * @param {array} params.include     默认: [ ], 排除指定目录ID的分类, 如: [1, 2, 3]
 * @param {string} params.order      默认: "asc", 可选: "asc","desc"
 * @param {string} params.orderby    默认: "name", 可选: "id","include","name","slug","include_slugs","term_group","description","count"
 * @param {array} params.hide_empty  默认: false, 如果为 true, 返回必须有文章的分类
 * @param {array} params.parent      包含指定父级目录ID的分类, 如: [1, 2, 3]
 * @param {array} params.post        包含指定文章ID的分类, 如: [1, 2, 3]
 * @param {array} params.slug        包含指定 slug 的分类, 如: ['slug1', 'slug2']
 */
export function GetCategories(params={}) {
  return request('categories', 'get', params);
}

/**
 * 获取评论列表
 *
 * @author crl
 * @param  {Object} params 请求参数
 * @param {string} params.context            默认: "view", 可选: "view","embed","edit"
 * @param {integer} params.page              默认: 1, 当前分页
 * @param {integer} params.per_page          默认: 10, 分页大小
 * @param {string} params.search             搜索内容
 * @param {string} params.after              指定日期之后的内容, 如: "2020.02.02"
 * @param {array} params.author              默认: [ ], 包含指定作者ID的内容, 如: [1, 2, 3]，需要授权
 * @param {array} params.author_exclude      默认: [ ], 排除指定作者ID的频率, 如: [1, 2, 3]，需要授权
 * @param {array} params.author_email        返回指定作者电子邮件的内容，需要授权
 * @param {string} params.before             指定日期之前的内容, 如: "2020.02.02"
 * @param {array} params.exclude             默认: [ ], 包含指定评论ID的内容, 如: [1, 2, 3]
 * @param {array} params.include             默认: [ ], 排除指定评论ID的内容, 如: [1, 2, 3]
 * @param {integer} params.offset            结果偏移
 * @param {string} params.order              默认: "desc", 可选: "asc","desc"
 * @param {string} params.orderby            默认: "date_gmt", 可选: "date","date_gmt","id","include","post","parent","type"
 * @param {array} params.parent              默认: [ ], 包含指定父ID的内容, 如: [1, 2, 3]
 * @param {array} params.parent_exclude      默认: [ ], 排除指定父ID的内容, 如: [1, 2, 3]
 * @param {array} params.post                默认: [ ], 包含指定文章ID的内容, 如: [1, 2, 3]
 * @param {array} params.status              默认: "approve", 返回指定状态的内容，需要授权
 * @param {array} params.type                默认: "comment", 返回指定类型的内容，需要授权
 * @param {array} params.password            如对象文章为密码保护，需要填写
 */
export function GetComments(params={}) {
  return request('comments', 'get', params);
}

/**
 * 获取评论详情
 * @author crl
 * @param  {integer} id       文章ID
 * @param  {String} password  文章密码，如有
 * @param  {String} context   默认: "view", 可选: "view","embed","edit"
 */
export function GetCommentsInfo(postid, id, password='', context='') {
  return request('comments/'+postid, 'get', {id, context, password});
}

/**
 * 获取页面列表
 *
 * @author crl
 * @param  {Object} params 请求参数
 * @param {string} params.context            默认: "view", 可选: "view","embed","edit"
 * @param {integer} params.page              默认: 1, 当前分页
 * @param {integer} params.per_page          默认: 10, 分页大小
 * @param {string} params.search             搜索内容
 * @param {string} params.after              指定日期之后的内容, 如: "2020.02.02"
 * @param {array} params.author              默认: [ ], 包含指定作者ID的内容, 如: [1, 2, 3]，需要授权
 * @param {array} params.author_exclude      默认: [ ], 排除指定作者ID的频率, 如: [1, 2, 3]，需要授权
 * @param {string} params.before             指定日期之前的内容, 如: "2020.02.02"
 * @param {array} params.exclude             默认: [ ], 包含指定页面ID的内容, 如: [1, 2, 3]
 * @param {array} params.include             默认: [ ], 排除指定页面ID的内容, 如: [1, 2, 3]
 * @param {array} params.menu_order          包含指定目录ID的内容, 如: [1, 2, 3]
 * @param {integer} params.offset            结果偏移
 * @param {string} params.order              默认: "desc", 可选: "asc","desc"
 * @param {string} params.orderby            默认: "date_gmt", 可选: "author","date","id","include","modified","parent","relevance","slug","include_slugs","title","menu_order"
 * @param {array} params.parent              默认: [ ], 包含指定父ID的内容, 如: [1, 2, 3]
 * @param {array} params.parent_exclude      默认: [ ], 排除指定父ID的内容, 如: [1, 2, 3]
 * @param {array} params.slug                包含指定 slug 的分类, 如: ['slug1', 'slug2']
 * @param {array} params.status              默认: "publish", 可选: "publish","future","draft","pending","private","trash","auto-draft","inherit","request-pending","request-confirmed","request-failed","request-completed","any", 返回指定状态的文章, 如: ['publish', 'future']
 */
export function GetPages(params={}) {
  return request('pages', 'get', params);
}

/**
 * 获取页面详情
 *
 * @author crl
 * @param  {integer} id       文章ID
 * @param  {String} password  文章密码，如有
 * @param  {String} context   默认: "view", 可选: "view","embed","edit"
 */
export function GetPagesInfo(id, password='', context='') {
  return request('pages/'+id, 'get', {context, password});
}

