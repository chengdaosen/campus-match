// pages/detail/index.js
import { myRequest } from '../../utils/service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postId: '',
    commentList: [],
    replyList: [],
    replysList: [],
  },
  getDetal() {
    const postId = this.data.postId
    myRequest({
      url: '/detail',
      method: 'POST',
      data: { postId },
    }).then((res) => {
      console.log('res', res)
      this.setData({ commentList: res.data })
    })
  },
  getReply() {
    myRequest({
      url: '/comment',
      method: 'GET',
    })
      .then((res) => {
        console.log('Response:', res)
        const replyList = []
        const replysList = []
        res.data.forEach((item) => {
          if (item.parent_id === 0) {
            replyList.push(item)
          } else {
            replysList.push(item)
          }
        })
        this.setData({
          replyList: replyList,
          replysList: replysList,
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        // 在请求失败时的处理逻辑
      })
  },
  onLoad(options) {
    this.setData({ postId: options.postId })
  },
  onShow() {
    this.getDetal()
    this.getReply()
  },
})
