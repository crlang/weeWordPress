// pages/topic/index.js
import {showToast, scrollLoadTheList, fixPostsList} from "../../utils/utils";
import {GetPages} from "../../utils/apis";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesData: '',
    pages: {
      page: 1,
      per_page: 40,
      done: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPagesList();
  },

  getPagesList() {
    let pages = this.data.pages;
    if (pages.done) return false;
    wx.showLoading({title:"加载中...", mask:true});
    GetPages({
      context: 'embed',
      page: pages.page,
      per_page: pages.per_page
    }).then(res => {
      res = scrollLoadTheList(this, fixPostsList(res), 'postsData');
      this.setData({
        pagesData: res
      });
    });
  },

  bindDetail(e) {
    let id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: '/pages/topic/detail?id='+id
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})