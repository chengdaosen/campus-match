Component({
  data: {
    path: 'pages/add/index',
    selected: 0,
    color: '#6e6d6b',
    selectedColor: '#0061b0',
    borderStyle: 'white',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        iconPath: '../assets/icon/首页.png',
        selectedIconPath: '../assets/icon/首页点击.png',
      },
      {
        pagePath: '/pages/my/index',
        text: '我的',
        iconPath: '../assets/icon/我的.png',
        selectedIconPath: '../assets/icon/我的点击.png',
      },
    ],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index,
      })
      console.log('Selected value:', this.data.selected)
    },
  },
})
