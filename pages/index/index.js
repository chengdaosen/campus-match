Page({
  data: {
    value: '',
  },
  onSearch() {
    console.log('搜索了')
  },
  // 页面显示时触发
  onShow() {
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
})
