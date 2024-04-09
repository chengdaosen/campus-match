// 修改 getUserProfile 函数，返回 Promise 对象
import { myRequest } from './service'

export default function getUserProfile() {
  return new Promise((resolve, reject) => {
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
              })
                .then((res) => {
                  getApp().globalData.userInfo.username = res.data.username
                  getApp().globalData.userInfo.head_pic = res.data.head_pic
                  getApp().globalData.usersLike = res.data.usersLikes
                  getApp().globalData.openId = res.data.openid
                  console.log('现在全局数据', getApp().globalData)
                  wx.setStorageSync('token', res.data.openid)
                  // 在获取用户信息成功后执行后续代码
                  resolve()
                })
                .catch((error) => {
                  reject(error)
                })
            }
          },
        })
      },
      fail: (res) => {
        console.log('授权失败', res)
        wx.showToast({
          icon: 'error',
          title: '获取用户失败',
        })
        wx.hideLoading()
        reject(res)
      },
    })
  })
}
