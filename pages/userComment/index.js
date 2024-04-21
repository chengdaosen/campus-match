import { myRequest } from '../../utils/service'
Page({
  data: {
    active: 0,
    commentList: [],
    replayList: [],
  },

  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    })
  },
  getMyComment() {
    const openId = wx.getStorageSync('token')
    myRequest({
      url: '/myComment',
      method: 'POST',
      data: { openId },
    })
      .then((res) => {
        console.log('Response:', res.data)
        this.setData({
          commentList: res.data.posts,
          replayList: res.data.relatedComments,
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        // 在请求失败时的处理逻辑
      })
  },
  onShow() {
    this.getMyComment()
  },
})
