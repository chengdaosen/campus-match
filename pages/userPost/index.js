// pages/personal/index.js
import { myRequest } from '../../utils/service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    loading: true, // 添加加载状态属性
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},
  getUserPost() {
    const openId = wx.getStorageSync('token')
    myRequest({
      url: '/personal/post',
      method: 'POST',
      data: { openId },
    }).then((res) => {
      console.log('个人中心信息：', res.data)
      this.setData({
        commentList: res.data,
        loading: false, // 数据获取完成后设置加载状态为 false
      })
    })
  },
  //更新删除后的数据
  deleteUsersPost() {
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1000,
    })
    console.log('111111111111111111111111111111111')
    this.getUserPost()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserPost()
  },
})
