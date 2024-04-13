const { myRequest } = require('../../utils/service')
Page({
  data: {
    avatarUrl: '',
    username: '',
    avatarUrlTmpFile: '',
    gender: '',
    genderArray: ['男', '女'],
    genderIndex: 0,
    qq: '',
    wechat: '',
    tempFilePath: '',
  },
  onLoad() {},
  onShow() {
    this.getUserInfo()
  },
  bindchooseavatar(e) {
    console.log('avatarUrl', e.detail.avatarUrl)
  },
  bindPickerChange(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderArray[e.detail.value],
    })
  },
  formSubmit() {
    if (this.data.tempFilePath) {
      // 上传图片
      console.log('this.data', this.data.tempFilePath)
      wx.uploadFile({
        url: 'http://127.0.0.1:3000/avatarUrl',
        filePath: this.data.tempFilePath,
        name: 'file',
        formData: {
          openid: wx.getStorageSync('token'),
        },
        success(res) {
          const data = JSON.parse(res.data)
          console.log('upload success')
          console.log('成功获取到用户头像存入数据库:', data.avatarUrl)
          getApp().globalData.userInfo.head_pic = data.avatarUrl
        },
        fail(res) {
          console.log('upload fail', res)
        },
      })
    }
    console.log('form发生了submit事件，携带数据为：', this.data.gender)
    myRequest({
      url: '/updateInfo',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('token'),
        username: this.data.username,
        sex: this.data.gender,
        wechat: this.data.wechat,
        qq: this.data.qq,
      },
    }).then((res) => {
      if (res.statusCode == 200) {
        getApp().globalData.userInfo.username = this.data.username
        getApp().globalData.userInfo.sex = this.data.gender
        getApp().globalData.userInfo.wechat = this.data.wechat
        getApp().globalData.userInfo.qq = this.data.qq
        wx.showToast({
          icon: 'success',
          title: '个人信息修改成功',
          success: () => {
            // 延迟一段时间后返回上一级页面
            setTimeout(() => {
              wx.navigateBack({
                delta: 1, // 返回的页面数，1表示返回上一级页面
              })
            }, 1500) // 延迟1.5秒
          },
        })
      }
    })
  },
  chooseavatar() {
    wx.chooseImage({
      count: 1, // 一次选择一张图片
      sizeType: ['original'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        console.log('tempFilePaths', tempFilePaths)
        this.setData({
          avatarUrl: tempFilePaths[0],
        })
        // 下载头像图片
        wx.downloadFile({
          url: tempFilePaths[0],
          success: (res) => {
            if (res.statusCode === 200) {
              console.log('下载成功，临时文件路径为：', this)
              this.data.tempFilePath = res.tempFilePath
              console.log('获取到用户头像tempFilePath：' + this.data.tempFilePath)
            }
          },
        })
        // 选择的图片临时文件路径
      },
    })
  },

  getUserInfo() {
    const username = getApp().globalData.userInfo.username
    const avatarUrl = getApp().globalData.userInfo.head_pic
    const wechat = getApp().globalData.userInfo.wechat
    const qq = getApp().globalData.userInfo.qq
    const sex = getApp().globalData.userInfo.sex
    if (username || avatarUrl || wechat || qq || sex) {
      this.setData({
        username,
        avatarUrl,
        wechat,
        qq,
        gender: sex,
      })
    }
    console.log('sex', sex)
    if (sex == '女') {
      this.setData({
        genderIndex: 1,
      })
    }
  },
})
