import { myRequest } from '../../utils/service'
import getUserProfile from '../../utils/getUserInfo'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    flag: {
      type: Boolean,
      value: false,
    },
    commentList: {
      type: Array,
      value: [],
      // observer: '_updateCommentList',
    },
    replyList: {
      type: Array,
      value: [],
    },
    replysList: {
      type: Array,
      value: [],
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
    replayList(val) {
      console.log('新replayList值', val)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 存储当前处于评论状态的帖子的标识
    activePostId: null,
    value: '',
    placeholder: '请输入评论内容',
    reply_id: '',
    reply_name: '',
    parent_id: '',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击下方评论进行回复
    toReply(e) {
      const openId = wx.getStorageSync('token')
      if (openId) {
        const { postId, id, username } = e.currentTarget.dataset
        console.log('获取到的信息', postId, id, username)
        this.setData({
          placeholder: '回复' + username + ':',
        })
        const reply_name = username
        const reply_id = id
        const parent_id = postId
        this.setData({
          activePostId: postId,
          reply_id,
          reply_name,
          parent_id,
        })
      }
    },
    //打开或关闭评论框
    commentStatus(postId) {
      const { activePostId } = this.data
      // 如果点击的帖子已经是处于评论状态，则隐藏评论框
      if (activePostId === postId) {
        this.setData({
          activePostId: null,
          placeholder: '请输入评论内容',
        })
      } else {
        // 如果点击的帖子不是处于评论状态，则显示评论框
        this.setData({
          activePostId: postId,
        })
      }
    },
    //评论
    onCommentTap(e) {
      const postId = e.currentTarget.dataset.postId
      const openId = wx.getStorageSync('token')
      if (openId) {
        this.commentStatus(postId)
      } else {
        const that = this
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
                that.commentStatus(postId)
              })
            }
          },
        })
      }
    },
    //发送评论
    toSend(e) {
      if (this.data.placeholder !== '请输入评论内容') {
        const that = this
        const parmas = {
          text: this.data.value,
          username: getApp().globalData.userInfo.username,
          postId: this.data.activePostId,
          reply_name: this.data.reply_name,
          reply_id: this.data.reply_id,
          parent_id: this.data.parent_id,
          openId: wx.getStorageSync('token'),
        }
        myRequest({
          url: '/comment/reply',
          method: 'POST',
          data: parmas,
        })
          .then((res) => {
            if (res.statusCode === 200) {
              console.log('评论成功', res)
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 2000,
              })
              that.data.placeholder = '请输入评论内容'
              that.commentStatus(this.data.activePostId)
              that.triggerEvent('toUpdateReplay')
            }
          })
          .catch((error) => {
            console.error('评论失败', error)
            wx.showToast({
              title: '评论失败，请稍后重试',
              icon: 'error',
              duration: 2000,
            })
          })
      } else {
        const that = this
        const postId = e.currentTarget.dataset.postId
        const openId = wx.getStorageSync('token')
        const username = getApp().globalData.userInfo.username
        const text = this.data.value
        const pramas = { postId, openId, username, text }
        myRequest({
          url: '/comment',
          method: 'POST',
          data: pramas,
        })
          .then((res) => {
            if (res.statusCode === 200) {
              console.log('评论成功', res)
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 2000,
              })
              that.commentStatus(postId)
              that.triggerEvent('toUpdateReplay')
            }
          })
          .catch((error) => {
            console.error('评论失败', error)
            wx.showToast({
              title: '评论失败，请稍后重试',
              icon: 'error',
              duration: 2000,
            })
          })
      }
    },
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
    //设置举报功能
    onReportTap(e) {
      const that = this
      const openId = wx.getStorageSync('token')
      const postId = e.currentTarget.dataset.postId
      if (openId) {
        // 用户已登录，发送举报请求
        this.sendReportRequest(postId, openId)
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
                // 发送举报请求
                that.sendReportRequest(postId, newOpenId)
              })
            }
          },
        })
      }
    },
    sendReportRequest(postId, openId) {
      let complainJson = ['敏感信息', '色情淫秽', '垃圾广告', '语言辱骂', '其它']
      wx.showActionSheet({
        itemList: complainJson,
        success(res) {
          const tag = complainJson[res.tapIndex]
          myRequest({
            url: '/complain',
            method: 'POST',
            data: { postId, openId, tag },
          })
            .then((res) => {
              if (res.statusCode === 200) {
                console.log('举报成功', res)
                wx.showToast({
                  title: '举报成功',
                  icon: 'success',
                  duration: 2000,
                })
              }
            })
            .catch((error) => {
              console.error('举报失败', error)
              wx.showToast({
                title: '举报失败，请稍后重试',
                icon: 'error',
                duration: 2000,
              })
            })
        },
        fail(res) {
          console.log(res.errMsg)
        },
      })
    },

    onDeleteTap(e) {
      const postId = e.currentTarget.dataset.postId
      console.log('postId:', postId)
      this.sendDeleteRequest(postId)
    },
    sendDeleteRequest(postId) {
      const that = this
      wx.showModal({
        title: '提示',
        content: '确定要删除该帖子吗？',
        success(res) {
          if (res.confirm) {
            // 用户点击了确定按钮，执行删除操作
            myRequest({
              url: '/delete',
              method: 'POST',
              data: { postId },
            })
              .then((res) => {
                // 触发自定义事件
                console.log('res', res)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                })
                that.triggerEvent('toDeleteUsersPost')
              })
              .catch((error) => {
                wx.showToast({
                  title: '删除失败',
                  icon: 'error',
                  duration: 1000,
                })
                console.error('点赞请求发生错误：', error)
              })
          } else if (res.cancel) {
            console.log('用户取消删除')
          }
        },
      })
    },
    goToUserProfile(e) {
      const openId = e.currentTarget.dataset.openid
      wx.navigateTo({
        url: '/pages/personal/index?username=' + openId,
      })
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
        })
    },
  },
})
