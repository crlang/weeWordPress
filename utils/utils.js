import {siteUrl, miniProName} from '../weeWPress.config';

// 接口地址
export const apiUrl = siteUrl + '/wp-json/';
// 内容接口地址
export const api_v2 = apiUrl + 'wp/v2/';

// 注意，使用新API或组件的时候，记得使用下方测试是否可在当前版本使用
// wx.canIUse(string schema)
// 使用 ${API}.${method}.${param}.${options} 或者 ${component}.${attribute}.${option} 方式来调用


// API 地址检测
if (!wx.getStorageSync('siteApiStatus')) {
  !(function apiTest(){
    request('').then(res => {
      console.log(res);
      wx.setStorageSync('siteApiStatus',true);
    }).catch(err => {
      console.log('err',err);
      wx.removeStorageSync('siteApiStatus');
      wx.showModal({
        title: 'API 地址异常',
        content: '请访问 ' + apiUrl + ' 能否正常。\r\n请参考文章 https://www.darlang.com/?p=900！',
        showCancel: false
      });
    });
  })();
}


/**
 * 修复文章列表数据
 *
 * @author crl
 * @param  {[type]}  list   [description]
 * @param  {Boolean} detail [description]
 * @return {[type]}
 */
export function fixPostsList(list, detail = true) {
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.excerpt) {
      if (item.excerpt.protected) {
        item.excerpt = '文章受密码保护~~~';
      }else {
        item.excerpt = item.excerpt.rendered.replace(/<[^>]+>/g,"");
        item.excerpt = item.excerpt.split('&hellip;')[0] + '...';
      }
    }else {
      item.excerpt = '文章无描述~~~';
    }
    item.date = formatTime(item.date, false);
    // 存在文章内容时
    if (item.content) item.content = item.content.rendered || '';

    item.title = item.title.rendered || '';
    item.author_name = '互联网';
    item.author_avatar = '/images/default_avatar.png';

    if (item._embedded) {
      if (item._embedded.author && item._embedded.author[0]) {
        item.author_name = item._embedded.author[0].name || item.author_name;
        item.author_avatar = item._embedded.author[0].avatar_urls[48] || item.author_avatar;
      }

      if (!item.featured_media_url) {
        item.featured_media_url = '/images/default_article.png';
        if (item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]) {
          item.featured_media_url = item._embedded['wp:featuredmedia'][0].source_url || item.thumb;
        }
      }

      if (item._embedded['wp:term']) {
        if (!item.categories && !item.categories[0].name) {
          if (item._embedded['wp:term'][0]) {
            for (let ia = 0; ia < item._embedded['wp:term'][0].length; ia++) {
              item.categories.push(item._embedded['wp:term'][0][ia]);
            }
          }
        }

        if (!item.tags && !item.tags[0].name) {
          if (item._embedded['wp:term'][1]) {
            for (let ib = 0; ib < item._embedded['wp:term'][1].length; ib++) {
              item.tags.push(item._embedded['wp:term'][1][ib]);
            }
          }
        }
      }
    }
    console.log(item);
    delete item._embedded;
    delete item._links;
  }

  return list;
}



/**
 * 格式化时间
 *
 * @author crl
 * @param  {[type]}  date   时间戳或标准时间格式
 * @param  {[type]}  format 默认 null，返回斜杠格式，可选自定义格式或为 false 返回 xx 分钟前格式
 * @param  {Boolean} vigor  [description]
 * @return {[type]}
 */
export function formatTime(date, format = null) {

  // 个位数补零
  let formatNumber = (n) => {return n.toString()[1] ? n : '0' + n;};
  const fromatsRule = ['y','m','d','h','i','s'];

  // 时间戳处理
  if (date.match(/^\d+$/)) {
    date = date.toString();
    if (date.length > 11) date = date/1000;
  }

  // 时间处理
  let d = new Date(date);
  if (d == 'Invalid Date') return null;

  // 是否处理1小时内的时间
  if (format === false) {
    let now = new Date().getTime();
        now = parseInt((now - d.getTime()) / 1000);
    if (now < 60) {
      return "刚刚";
    }else if(now < 60*60) {
      return Math.floor( now / 60 ) + "分钟前";
    }else if(now < 60*60*24) {
      format = 'h:i';
    }else {
      format = 'M/D';
    }
  }

  let year = d.getFullYear(),
    month  = d.getMonth() + 1,
    day    = d.getDate(),
    hour   = d.getHours(),
    minute = d.getMinutes(),
    second = d.getSeconds();

  if (format === null) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }else {
    let res = [];
    res.push(year,month,day,hour,minute,second);
    res = res.map(formatNumber);
    format = format.toLowerCase();
    for (let i = 0; i < res.length; i++) {
      format = format.replace(fromatsRule[i], res[i]);
    }
    return format;
  }
}

/**
 * 验证手机号
 *
 * @param {*} str
 * @returns 返回布尔
 */
function checkMobile(str) {
  const mobileREG = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/);
  return mobileREG.test(str);
}

/**
 * 验证邮箱
 *
 * @param {*} str
 * @returns 返回布尔
 */
function checkEmail(str) {
  const emailREG = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);
  return emailREG.test(str);
}

/**
 * 获取 url 参数值
 *
 * @param  {string} url url地址
 * @param  {string} name 参数名称
 * @return {[type]}      返回参数内容
 */
function getUrlParam(name, url) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  url = url ? url : window.location.href;
  try {
    const s = url.split("?")[1];
    const r = s.match(reg) || null;
    if (r !== null) {
      return unescape(r[2]);
    }
  } catch (error) {
    console.error('非法url');
    return null;
  }
  return null;
}


/**
 * 处理滚动加载列表数据
 * @author crl
 * @param  {Object} self   页面this对象
 * @param  {Object} result 返回结果
 * @param  {String} type   需要并入的列表 key
 * @return {[type]}
 */
export function scrollLoadTheList(self={}, result={}, type = '') {
  let origData = self.data[type] || [];// 原有数据
  let newData = result || [];// 新增数据

  if (newData && newData.length > 0) {
    if (!origData || origData.length === 0) {
      origData = newData;
    }else {
      origData = origData.concat(newData);
    }
    // 返回数据小于定义页码大小，则默认加载完毕
    if (newData.length < self.data.pages.per_page) {
      self.setData({'pages.done': true});
    }
    self.setData({'pages.page': self.data.pages.page+1});
    return origData;
  }else {
    // 没数据返回，直接默认加载完毕
    self.setData({'pages.done': true});
  }
  return origData;
}

/**
 * 请求封装
 * @author crl
 * @param  {[type]} url    请求地址URL
 * @param  {String} method 请求方法
 * @param  {Object} data   请求参数
 * @return {[type]}
 */
export function request(url, method = 'get', data = {}) {
  let header = {
    'Content-Type': 'application/json',
    'Authorization': wx.getStorageSync('token') || ''
  };

  if (!url || typeof url !== 'string') {
    console.error("该地址 "+url+" 不错误，请求终止！");
    return false;
  }

  method = method.toLocaleUpperCase();
  if (method !== "GET" && method !== 'POST') {
    console.error("该地址 "+url+" 请求的 Method 不为 POST 或 GET ，请求终止！");
    return false;
  }

  // 删除空数据 - 默认
  if (data.saveNull) {
    delete data.saveNull;
  }else {
    if (data && JSON.stringify(data) !== '{}') {
      for (const k in data) {
        if (data[k] === null || data[k] === '' || data[k] === undefined) {
          delete data[k];
        }
      }
    }
  }

  // 非直接访问模式
  if (url.indexOf('http') !== 0) url = api_v2 + url;

  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function(res) {
        console.log('global success',res);
        if (res.errMsg === "request:ok" && res.statusCode === 200) return resolve(res.data);
        if (res.statusCode >= 500) {
          wx.redirectTo({
            url: '/pages/retry/index?url='+getCurrentPageUrl()
          });
        }
        return reject(res);
      },
      fail: function(err) {
        console.log('global fail',err);
        // showToast('系统繁忙', 'error');
        wx.redirectTo({
          url: '/pages/retry/index?url='+getCurrentPageUrl()
        });
        return reject(err);
      },
      complete: function() {
        try {
          wx.stopPullDownRefresh();// 数据返回后停止下拉刷新
          wx.hideLoading();
        } catch(e) {
          console.log(e);
        }
      }
    });
  });
}

/**
 * toast 消息提示封装
 *
 * @param {String} title 提示内容
 * @param {String} [type='none'] 默认无，提示图标[none:无图标,error:错误,success:成功,warning:警告]
 * @param {Number} [duration = 1200] 默认1200，消息提示框关闭时间
 */
function showToast(title, type = 'none', duration = 1200) {
  if (typeof title !== 'string') return;

  if (type === 'loading') {
    wx.showLoading({
      title,
      mask: true,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {}
    });
    return;
  }

  let image = '',
    icon = '';
  switch (type) {
  case 'error':
    image = '/images/tip_error.png';
    break;
  case 'success':
    image = '/images/tip_success.png';
    break;
  case 'warning':
    image = '/images/tip_warning.png';
    break;
  case 'none':
    icon = 'none';
    break;
  }

  wx.showToast({
    title,
    icon,
    image,
    duration,
    mask: true,
    success: function () { },
    fail: function () { },
    complete: function () { }
  });
}

/**
 * 获取当前小程序 url 带参数
 *
 * 注意：不能在 onlaunch 中使用
 * @return {[type]} 返回完整的当前页面url
 */
function getCurrentPageUrl(){
  let pages = getCurrentPages();    //获取加载的页面
  let currentPage = pages[pages.length-1];    //获取当前页面的对象
  let url = currentPage.route;    //当前页面url
  let options = currentPage.options;    //获取url中所带的参数
  let fullUrl = url + '?';
  for(let key in options){
    let value = options[key];
    fullUrl += key + '=' + value + '&';
  }
  fullUrl = fullUrl.substring(0, fullUrl.length-1);
  return escape(fullUrl);
}

// 页面标题
export const pageTitle = {
  default: miniProName,
};