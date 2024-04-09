import getUserProfile from '../../utils/getUserInfo'
import { myRequest } from '../../utils/service'
Page({
  data: {
    userInfo: {},
    token: '',
    usersLike: [],
  },

  /**
   * onLoad
   */
  onLoad() {},

  /**
   * onShow
   */
  onShow() {
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      })
    }
    const token = wx.getStorageSync('token')
    if (token) {
      this.getUserLikeTotal()
      this.setData({
        userInfo: getApp().globalData.userInfo,
        token: token,
      })
      console.log('获取到的userInfo', getApp().globalData.userInfo)
    }
  },
  //页面刷新时获取用户点赞数量
  getUserLikeTotal() {
    const openId = wx.getStorageSync('token')
    myRequest({
      url: '/usersLike',
      method: 'POST',
      data: { openId: openId },
    }).then((res) => {
      console.log('用户点赞数量', res.data)
      this.setData({
        usersLike: res.data,
      })
    })
  },
  getUserInfo() {
    getUserProfile()
      .then(() => {
        this.setData({
          userInfo: getApp().globalData.userInfo,
          token: getApp().globalData.openId,
          usersLike: getApp().globalData.usersLike,
        })
      })
      .catch((error) => {
        console.error('获取用户信息失败', error)
      })
  },
  toUserLike() {
    if (getApp().globalData.openId) {
      wx.navigateTo({
        url: '../userLike/index',
      })
    }
  },
  /**
   * goto 微信客服页
   */
  gotoCustomerServicePage() {
    wx.openCustomerServiceChat({
      extInfo: { url: 'https://work.weixin.qq.com/kfid/kfc7c6ec02919b92d1b' },
      corpId: 'wwe1ddc5c6a7b1f32b',
    })
  },

  loginout() {
    wx.showModal({
      title: '提示',
      content: '确认要退出登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '正在退出登录' })
          // 清除用户信息
          getApp().globalData.userInfo = { username: '', head_pic: '' }
          console.log('清除用户信息', getApp().globalData.userInfo)
          // 清除本地缓存中的token
          wx.removeStorage({
            key: 'token',
            success: () => {
              // 清除成功后，更新页面数据
              this.setData({
                token: false,
              })
              wx.hideLoading() // 隐藏加载提示
              wx.showToast({
                title: '退出登录成功',
                icon: 'success',
                duration: 2000,
              })
            },
            fail: () => {
              wx.hideLoading() // 隐藏加载提示
              wx.showToast({
                title: '退出登录失败，请重试',
                icon: 'error',
                duration: 2000,
              })
            },
          })
        }
      },
    })
  },
})
