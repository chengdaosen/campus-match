// pages/personal/index.js
import { myRequest } from '../../utils/service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    param: '',
    userInfo: [],
    commentList: [],
    loading: true, // 添加加载状态属性
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const param = options.username
    this.setData({
      param,
    })
  },
  getUserPost() {
    this.setData({
      loading: true,
    })
    console.log('1111111111111111111111111111111111')
    const openId = this.data.param
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

  getPersonalInfo() {
    this.setData({
      loading: true,
    })
    const openId = this.data.param
    myRequest({
      url: '/personal',
      method: 'POST',
      data: { openId },
    }).then((res) => {
      console.log('个人中心信息：', res.data)
      this.setData({
        userInfo: res.data,
        loading: false, // 数据获取完成后设置加载状态为 false
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserPost()
    this.getPersonalInfo()
  },
})
