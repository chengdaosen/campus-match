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
      // observer: '_updateCommentList',
    },
    usersLikeList: {
      type: Array,
      value: [],
    },
  },
  observers: {
    usersLikeList(val) {
      console.log('新usersLikeList值', val)
      if (Array.isArray(val)) {
        console.log('usersLikeList是数组')
      } else {
        console.log('usersLikeList不是数组，实际类型为:', typeof val)
      }
    },
    commentList(val) {
      console.log('新commentList值', val)
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
    onLikeTap(e) {
      const that = this
      const openId = wx.getStorageSync('token')
      const postId = e.currentTarget.dataset.postId
      if (openId) {
        // 用户已登录，发送点赞请求
        this.sendLikeRequest(postId, openId)
      } else {
        // 用户未登录，提示登录并进行微信授权登录
        wx.showModal({
          title: '登录提醒',
          content: '您还未登录，是否进行微信授权登录',
          confirmText: '是',
          cancelText: '否',
          success(res) {
            if (res.confirm) {
              // 用户确认登录，进行微信授权登录
              getUserProfile().then(() => {
                const newOpenId = wx.getStorageSync('token')
                // 发送点赞请求
                that.sendLikeRequest(postId, newOpenId)
              })
            }
          },
        })
      }
    },

    sendLikeRequest(postId, openId) {
      const that = this
      myRequest({
        url: '/posts/like',
        method: 'POST',
        data: { postId, openId },
      })
        .then((res) => {
          // 触发自定义事件
          that.triggerEvent('toGetUsersLikeList')
        })
        .catch((error) => {
          console.error('点赞请求发生错误：', error)
          // 在这里添加适当的错误处理
        })
    },

    // _updateCommentList(newCommentList) {
    //   // 使用 setData 方法更新 commentList 数据
    //   this.setData({
    //     commentList: newCommentList,
    //   })
    //   // 触发自定义事件，通知父组件评论列表已更新
    //   this.triggerEvent('commentListChange', { commentList: newCommentList })
    // },
  },
})
