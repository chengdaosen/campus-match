const { myRequest } = require('../../utils/service')
Page({
  data: {
    value: '',
    usersLikeList: [],
    commentList: [], //帖子列表
    replayList: [],
    commentTypeIndex: 1, //评论类型选择的index
    commentType: ['最热', '最新'],
    flag: false,
  },
  onSearch() {
    console.log('搜索', this.data.value)
    this.getPosts()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    })
  },
  //获取用户喜欢的帖子
  getUsersLike() {
    const openId = wx.getStorageSync('token')
    myRequest({
      url: '/usersLike',
      method: 'POST',
      data: { openId },
    }).then((res) => {
      this.getPosts()
      // this.triggerEvent('toUsersLikeListUpdated', { usersLikeList: res.data })
      this.setData({
        usersLikeList: res.data.results,
      })
    })
  },
  //获取回复内容
  getReplay() {
    myRequest({
      url: '/comment',
      method: 'GET',
    })
      .then((res) => {
        console.log('Response:', res)
        this.setData({
          replayList: res.data,
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        // 在请求失败时的处理逻辑
      })
  },

  //获取帖子内容
  getPosts() {
    const openId = wx.getStorageSync('token')
    const params = {
      commentTypeIndex: this.data.commentTypeIndex,
      openId: openId,
      keyword: this.data.value,
    }
    myRequest({
      url: '/posts',
      method: 'POST',
      data: params,
    }).then((res) => {
      this.setData({
        commentList: res.data,
      })
    })
  },
  // 页面显示时触发
  onShow() {
    const openId = wx.getStorageSync('token')
    this.getReplay()
    if (openId) {
      this.getUsersLike()
    }
    this.getPosts()
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
  //更新评论类型数据请求
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    this.setData({
      commentTypeIndex: index,
    })
    this.getPosts()
  },
})
