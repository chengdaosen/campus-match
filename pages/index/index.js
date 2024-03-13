const { myRequest } = require('../../utils/service')

Page({
  data: {
    value: '',
    posts:[]
  },
  onSearch() {
    console.log('搜索了')
  },
  getPosts() {
    myRequest({
      url: '/posts',
      method: 'GET',
    }).then((res) => {
      this.setData({
        posts: res.data
      });
    })
  },
  // 页面显示时触发
  onShow() {
    this.getPosts()
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
})
