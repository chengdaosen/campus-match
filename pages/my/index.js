import { myRequest } from '../../utils/service'

Page({
  data: {
    userInfo: {},
    token: '',
  },

  // 页面加载时触发
  onLoad() {
  },

  // 页面显示时触发
  onShow() {
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      })
    }
  },

  getUserProfile(e) {
    wx.showLoading({
      title: '正在登录...',
      mask: true,
    })

    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        let username = res.userInfo.nickName
        let headPic = res.userInfo.avatarUrl

        wx.login({
          success: async (res) => {
            if (res.errMsg === 'login:ok') {
              myRequest({
                url: '/users',
                method: 'POST',
                data: { code: res.code, username: username, headPic: headPic },
              }).then((res) => {
                wx.setStorageSync('token', res.data.openid)
              })
            }
          },
        })

        this.setData({
          userInfo: res.userInfo,
          token: true,
        })
      },
      fail: (res) => {
        console.log('授权失败', res)
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
      token: false,
    })
    wx.removeStorage({
      key: 'token',
    })
  },
})
