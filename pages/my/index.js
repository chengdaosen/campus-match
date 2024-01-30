import { myRequest } from '../../utils/service'
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  getUserProfile(e) {
    wx.showLoading({
      title: '正在登录...',
      mask: true,
    })
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '获取用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('授权成功', res)
        let username = res.userInfo.nickName
        let headPic = res.userInfo.avatarUrl
        wx.hideLoading()
        wx.login({
          success: async (res) => {
            console.log('登录返回来的', res)
            if (res.errMsg === 'login:ok') {
              myRequest({
                url: '/users',
                method: 'POST',
                data: { code: res.code, username: username, headPic: headPic },
              }).then((res) => {
                console.log(res)
              })
            }
          },
        })
        wx.setStorageSync('user', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      },
      fail() {
        console.log('授权失败')
        wx.showToast({
          icon: 'error',
          title: '获取用户失败',
        })
        wx.hideLoading()
      },
    })
  },
  loginout() {
    this.setData({
      userInfo: '',
      hasUserInfo: false,
    })
    wx.removeStorage({
      key: 'user',
    })
  },
})
