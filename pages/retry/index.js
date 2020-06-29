// pages/retry/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({
      url: opt.url
    });
  },


  /**
   * 点击事件
   */
  bindReload() {
    let url = this.data.url;
    let pageUrl = url.split('?')[0];
    let tabsList = ['pages/index/index', 'pages/post/post', 'pages/topic/topic', 'pages/member/member'];
    if (tabsList.includes(pageUrl)) {
      wx.switchTab({
        url: '/' + unescape(url)
      });
    }else {
      wx.redirectTo({
        url: '/' + unescape(url)
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
});
