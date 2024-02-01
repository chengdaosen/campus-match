Component({
  data: {
    selected: 0,
    color: '#6e6d6b',
    selectedColor: '#0061b0',
    borderStyle: 'white',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
      },
      {
        pagePath: '/pages/my/index',
        text: '我的',
      },
    ],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      // 更新 list 数组中的 selected 字段
      const newList = this.data.list.map((item, index) => {
        return {
          ...item,
          selected: index === data.index,
        };
      });
      this.setData({
        list: newList,
      });
      wx.switchTab({ url });
    },
  },
})
