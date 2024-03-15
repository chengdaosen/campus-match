import getUserProfile from '../../utils/getUserInfo'
Page({
  data: {
    userInfo: {},
    token: '',
  },

  // 页面加载时触发
  onLoad() {
  },

  // 页面显示时触发
  onShow() {
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
      })
    }
    const token = wx.getStorageSync('token');
    if(token){
      const userInfo = getApp().globalData.userInfo;
      this.setData({
        userInfo: userInfo,
        token: token
      });
    }
  },

  // 调用getUserProfile函数
  getUserInfo() {
    getUserProfile().then(() => {
      const token = wx.getStorageSync('token');
      const userInfo = getApp().globalData.userInfo;
      this.setData({
        userInfo: userInfo,
        token: token
      });
    }).catch((error) => {
      console.error('获取用户信息失败', error);
      // 处理获取用户信息失败的情况
    });
  },
  

  loginout() {
    this.setData({
      userInfo: '',
      token: false,
    })
    wx.removeStorage({
      key: 'token',
    })
  },
})
