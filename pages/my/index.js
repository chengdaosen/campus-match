import getUserProfile from '../../utils/getUserInfo'
const APP = getApp();

Page({
  data: {
    userInfo: {},
    token: '',
  },

  /**
   * onLoad
   */
  onLoad() {

  },

  /**
   * onShow
   */
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
    });
  },
  /**
   * 刷新用户信息
   */
  refreshUserInfo() {
    let _this = this;

    if (this.data.appGlobalData.isAuth) {
      APP.REQUEST.GET('users/mine').then(function(result) {
        APP.globalData.userInfo = result.data;
        _this.setData({appGlobalData: APP.globalData});

        // 更新 NoticeBadge
        APP.resetNoticeBadgeAtTabBar();
      }).catch(function() {
        APP.AUTH.userLogout();
        _this.setData({appGlobalData: APP.globalData});
      });
    }
  },

  /**
   * goto 微信客服页
   */
  gotoCustomerServicePage() {
    wx.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc7c6ec02919b92d1b'},
      corpId: 'wwe1ddc5c6a7b1f32b',
    });
  },

  loginout() {
    wx.showModal({
      title: '提示',
      content: '确认要退出登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '正在退出登录' });
          // 清除用户信息
          getApp().globalData.userInfo = null;
          // 清除本地缓存中的token
          wx.removeStorage({
            key: 'token',
            success: () => {
              // 清除成功后，更新页面数据
              this.setData({
                token: false
              });
              wx.hideLoading(); // 隐藏加载提示
              wx.showToast({
                title: '退出登录成功',
                icon: 'success',
                duration: 2000
              });
            },
            fail: () => {
              wx.hideLoading(); // 隐藏加载提示
              wx.showToast({
                title: '退出登录失败，请重试',
                icon: 'error',
                duration: 2000
              });
            }
          });
        }
      }
    });
  }
  
});
