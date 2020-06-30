// pages/posts/detail.js
import {fixPostsList} from '../../utils/utils';
import {GetPagesInfo, GetComments} from '../../utils/apis';
import WxParse from '../../libs/wxParse/wxParse.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    infoData: '',
    infoContent: '',
    commentsData: '',
    hasProtected: false, // 受保护文章
    pagesPwd: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.setData({
      id: opt.id
    });
    this.getTopic();

  },

  // 获取文章
  getTopic() {
    wx.showLoading({title:"加载中..."});
    GetPagesInfo(this.data.id, this.data.pagesPwd).then(res => {
      console.log(res);
      WxParse.wxParse('infoContent', 'html', res.content.rendered, this);
      if (res) {
        if (res.content && res.content.protected === true) {
          if (this.data.hasProtected && res.content.rendered !== '') {
            this.setData({
              hasProtected: false
            });
          }else {
            this.setData({
              hasProtected: true
            });
          }
        }
        this.setData({
          infoData: fixPostsList([res], true)[0]
        });
        this.getComment();
      }
    }).catch(err => {
      console.log(err);
    });
  },

  // 输入文章密码
  bindPwd(e) {
    let v = e.detail.value;
    if (!v) return;
    this.setData({
      pagesPwd: v
    });
  },

  // 获取评论
  getComment() {
    GetComments({
      post: this.data.id,
      password: this.data.pagesPwd
    }).then(res => {
      console.log(res);
    });
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
