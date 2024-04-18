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
