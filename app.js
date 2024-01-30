// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // //检查是否授权
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 用户已经授权过，直接调用getUserProfile获取用户信息
    //       getUserProfile();
    //     } else {
    //       // 用户未授权，显示授权按钮
    //       // 在需要获取用户信息的按钮点击事件中调用wx.getUserProfile
    //     }
    //   }
    // });
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  globalData: {
    userInfo: null,
  },
})
