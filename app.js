// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    tabBar: {
      backgroundColor: '#ffffff',
      color: '#333333',
      selectedColor: '#26C55E',
      list: [
        {
          pagePath: '/pages/spaceHomePage/spaceHomePage',
          text: '觅书',
          iconPath: 'img/icon-findbook.png',
          selectedIconPath: 'img/icon-findbook1.png',
        },
        {
          pagePath: '/pages/found/found',
          text: '发现',
          iconPath: 'img/icon-found.png',
          selectedIconPath: 'img/icon-found1.png',
        },
        {
          pagePath: '/pages/shareTherelease/shareTherelease',
          isSpecial: true,
          text: '共享/发布',
          iconPath: 'img/icon_release.png',
          selectedIconPath: 'img/icon_release.png',
        },
        {
          pagePath: '/pages/publicWelfare/publicWelfare',
          text: '公益',
          iconPath: 'img/icon-publicwelfare.png',
          selectedIconPath: 'img/icon-publicwelfare1.png',
        },
        {
          pagePath: '/pages/mine/mine',
          text: '我的',
          iconPath: 'img/icon-mine.png',
          selectedIconPath: 'img/icon-mine1.png',
        },
      ],
    },
  },
  editTabbar: function () {
    //隐藏系统tabbar
    wx.hideTabBar()
    let tabbar = this.globalData.tabBar
    let currentPages = getCurrentPages()
    let _this = currentPages[currentPages.length - 1]
    let pagePath = _this.route
    pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath)
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false
      tabbar.list[i].pagePath == pagePath && (tabbar.list[i].selected = true)
    }
    _this.setData({
      tabbar: tabbar,
    })
  },
})
