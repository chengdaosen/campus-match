import getUserProfile from '../utils/getUserInfo'
Component({
  data: {
    path: '/pages/post/index',
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
        pagePath: '/pages/mine/index',
        text: '我的',
        iconPath: '../assets/icon/我的.png',
        selectedIconPath: '../assets/icon/我的点击.png',
      },
    ],
  },
  attached() {},
  methods: {
    navigateToTargetPage() {
      // 在点击事件中进行路由跳转判断
      const token = wx.getStorageSync('token');
      if (token) {
        // 满足条件时进行跳转
        wx.navigateTo({
          url: '/pages/post/index'
        });
      } else {
        // 不满足条件时给出提示或者执行其他操作
        wx.showModal({
          title: '登录提醒',
          content: '您还未登录，是否进行微信授权登录',
          confirmText: '是',
          cancelText: '否',
          success(res) {
            if(res.confirm){
              getUserProfile().then(()=>{
                wx.navigateTo({
                  url: '/pages/post/index'
                });
              })
            }
          }
        });
      }
    },
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
