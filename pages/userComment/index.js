import { myRequest } from '../../utils/service'
Page({
  data: {
    active: 0,
    commentList: [],
    replyList: [],
    replysList: [],
    commentInfo: [],
    replyInfo: [],
  },

  onChange(event) {
    if (event.detail.name == 1) {
      this.getPostNews()
      this.getReplyNews()
    }
    if (event.detail.name == 0) {
      this.getMyComment()
    }
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
        const replyList = []
        const replysList = []
        if (res.data.relatedComments && res.data.relatedComments.length) {
          res.data.relatedComments.forEach((item) => {
            if (item.parent_id === 0) {
              replyList.push(item)
            } else {
              replysList.push(item)
            }
          })
          this.setData({
            commentList: res.data.posts,
            replyList: replyList,
            replysList: replysList,
          })
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        // 在请求失败时的处理逻辑
      })
  },
  //获取帖子收到的消息
  getPostNews() {
    const openId = wx.getStorageSync('token')
    myRequest({
      url: '/news',
      method: 'POST',
      data: { openId },
    })
      .then((res) => {
        console.log('Response:', res.data)
        this.setData({
          commentInfo: res.data.commentInfo,
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        // 在请求失败时的处理逻辑
      })
  },
  getReplyNews() {},
  toDetail(e) {
    console.log(e.currentTarget.dataset)
    const postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: '/pages/detail/index?postId=' + postId,
    })
  },
  onShow() {
    this.getMyComment()
  },
})
