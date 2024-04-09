// app.js
App({
  globalData: {
    userInfo: {
      head_pic: '',
      username: '',
    },
    openId: '',
    usersLike: [],
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.removeStorageSync('token')
  },
})
