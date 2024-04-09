Page({
  data: {
    avatarUrl: '',
    username: '',
    avatarUrlTmpFile: '',
    gender: '男',
    genderArray: ['男', '女'],
    genderIndex: 0,
    qq: '',
    wechat: '',
  },
  onLoad() {},
  onShow() {
    this.getAvatarUrl(), this.getUsername()
  },
  bindchooseavatar(e) {
    console.log('avatarUrl', e.detail.avatarUrl)
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
        //下载头像图片
        wx.downloadFile({
          url: tempFilePaths[0],
          success(res) {
            if (res.statusCode === 200) {
              const tempFilePath = res.tempFilePath
              console.log('获取到用户头像tempFilePath：' + tempFilePath)
              // 上传图片
              wx.uploadFile({
                url: 'http://127.0.0.1:3000/avatarUrl',
                filePath: tempFilePaths[0],
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
          },
        })
        // 选择的图片临时文件路径
      },
    })
  },
  getAvatarUrl() {
    // 异步获取头像 URL 的逻辑，例如从全局数据中获取
    const avatarUrl = getApp().globalData.userInfo.head_pic
    if (avatarUrl) {
      // 如果头像 URL 存在，则更新 data 中的 avatarUrl
      this.setData({
        avatarUrl,
      })
    }
  },
  getUsername() {
    const username = getApp().globalData.userInfo.username
    if (username) {
      // 如果头像 URL 存在，则更新 data 中的 avatarUrl
      this.setData({
        username,
      })
    }
  },
})
