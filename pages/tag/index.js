// pages/tag/index.js
const { myRequest } = require('../../utils/service')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const param = options.param
    this.getTagPost(param)
    // 在页面加载时动态设置标题文本
    wx.setNavigationBarTitle({
      title: param,
    })
  },
  getTagPost(tag) {
    myRequest({
      url: '/tags',
      method: 'POST',
      data: { tag },
    }).then((res) => {
      console.log('111111111', res.data)
      this.setData({
        commentList: res.data,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
})
