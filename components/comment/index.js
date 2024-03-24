import { myRequest } from '../../utils/service'
import getUserProfile from '../../utils/getUserInfo'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: [],
      observer: '_updateCommentList',
    },
    usersLikeList: {
      type: Array,
      value: [1, 1, 1],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    toAddLikeTotal(e) {
      const postId = e.currentTarget.dataset.postId
      const openId = wx.getStorageSync('token')
      myRequest({ url: '/posts/like', method: 'POST', data: { postId, openId } }).then(
        (res) => {
          console.log(res)
        }
      )
    },
    onLikeTap(e) {
      const that = this
      const openId = wx.getStorageSync('token')
      if (openId) {
        that.toAddLikeTotal(e)
      } else {
        wx.showModal({
          title: '登录提醒',
          content: '您还未登录，是否进行微信授权登录',
          confirmText: '是',
          cancelText: '否',
          success(res) {
            if (res.confirm) {
              getUserProfile().then(() => {
                that.toAddLikeTotal(e)
                that.triggerEvent('customEvent')
              })
            }
          },
        })
      }
    },
    _updateCommentList(newCommentList) {
      // 使用 setData 方法更新 commentList 数据
      this.setData({
        commentList: newCommentList,
      })
      // 触发自定义事件，通知父组件评论列表已更新
      this.triggerEvent('commentListChange', { commentList: newCommentList })
    },
  },
})
