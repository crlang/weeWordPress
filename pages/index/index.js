//index.js
import utils from '../../utils/utils.js';
import {formatTime, fixPostsList, scrollLoadTheList} from '../../utils/utils.js';
import {GetPosts, GetCategories} from '../../utils/apis';
import WxParse from '../../libs/wxParse/wxParse.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerData: '', // 封面文章
    categories: '', // 当前分类
    categoriesData: '', // 分类目录
    postsData: '', // 文章列表
    titleLength: 15,
    pages: {
      page: 1,
      per_page: 40,
      done: false
    },
    categoriesFixed: false,
    navOfficeTop: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    // 页面初始化
    this.getStickyPosts();
    // 获取过程置顶->分类->文章
  },

  // 获取置顶文章信息 - 必须设置特色图
  getStickyPosts() {
    wx.showLoading({title:"加载中...", mask:true});
    GetPosts({
      _embed: true,
      // sticky: true,
      page: 1,
      per_page: 5
    }).then(res => {
      console.log('Sticky res',res);
      this.setData({
        bannerData: fixPostsList(res)
      });
      // 先获取封面，再获取目录
      this.getCategories();
    }).catch(err => {
      console.log('Sticky err',err);
    });
  },

  // 获取文章列表
  getPostsList() {
    let pages = this.data.pages;
    if (pages.done) return false;
    wx.showLoading({title:"加载中...", mask:true});
    GetPosts({
      _embed: true,
      context: 'embed',
      page: pages.page,
      per_page: pages.per_page,
      categories: this.data.categories
    }).then(res => {
      console.log('Article res',res);
      res = scrollLoadTheList(this, fixPostsList(res), 'postsData');
      this.setData({
        postsData: res
      });
    }).catch(err => {
      console.log('Article err',err);
      // 页码超限处理
      if (err.data && err.data.code && err.data.code === "rest_post_invalid_page_number") {
        this.setData({
          'pages.done': true
        });
      }
    });
  },

  // 获取分类目录
  getCategories() {
    wx.showLoading({title:"加载中...", mask:true});
    GetCategories().then(res => {
      console.log('Categories res',res);
      this.setData({
        categoriesData: res
      });
      this.getCategoriesBox();
      this.getPostsList();
    }).catch(err => {
      console.log('Categories err',err);
    });
  },

  // 获取目录盒子信息
  getCategoriesBox() {
    let self = this;
    var query = wx.createSelectorQuery();
    query.select('#articles-nav').boundingClientRect(function(res) {
      console.log('box info:',res);
      self.setData({
        navOfficeTop: res.top
      });
    }).exec();
  },

  // 处理目录盒子
  checkCategoriesBoxScroll(pageOT) {
    let navOfficeTop = this.data.navOfficeTop;
    let categoriesFixed = this.data.categoriesFixed;
    if (navOfficeTop > -1) {
      if (pageOT >= navOfficeTop && !categoriesFixed) {
        this.setData({
          categoriesFixed: true
        });
      }
      if (pageOT < navOfficeTop && categoriesFixed) {
        this.setData({
          categoriesFixed: false
        });
      }
    }
  },

  // 点击分类
  bindCategory(e) {
    let id = e.currentTarget.dataset.id;
    if(id === '-1' ) id = '';
    this.setData({
      categories: id,
      postsData: '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getPostsList();
  },

  // 点击文章
  bindPosts(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/posts/detail?id=" + id
    });
  },

  /**
   * 生命周期函数--监听页面渲染
   */
  onReady: function () {
    // 页面渲染
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
  },

  /**
   * 页面事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 页面下拉
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页面触底
    this.getPostsList();
  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function (ev) {
    // 页面滚动
    this.checkCategoriesBoxScroll(ev.scrollTop);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面关闭
  },

  /**
   * 用户点击右上角转发
   */
  onShareAppMessage: function () {
    // 页面转发
  }
});