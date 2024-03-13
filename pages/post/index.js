const { myRequest } = require('../../utils/service')

// index.js
Page({
  data: {
    postContent: '',
    showPopup: false,
    selectedOption: '',
  },
  // 文本域输入事件处理函数
  handleInput(e) {
    this.setData({
      postContent: e.detail.value, // 更新帖子内容数据
    })
  },
  formSubmit() {
    // 获取文本域的内容
    const content = this.data.postContent
    const openid = wx.getStorageSync('token')
    // 发送 POST 请求到后端接口
    myRequest({
      url: '/publish',
      method: 'POST',
      data: {
        content: content,
        openid: openid,
      },
    }).then((res) => {
      console.log(res)
      if (res.statusCode == 200) {
        wx.showToast({
          icon: 'success',
          title: '帖子发布成功',
          success: () => {
            // 延迟一段时间后返回上一级页面
            setTimeout(() => {
              wx.navigateBack({
                delta: 1, // 返回的页面数，1表示返回上一级页面
              })
            }, 1500) // 延迟1.5秒
          },
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '帖子发布失败',
        })
      }
    })
  },
})
