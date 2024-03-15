
const APP = getApp();

Page({
  data: {
    appGlobalData: null,
    defaultUserCoverImagePath: 'https://dev.api.heycommunity.com/images/users/default-cover.jpg',
    defaultProfileWaveImagePath: 'https://dev.api.heycommunity.com//images/users/profile-wave.gif',
  },

  /**
   * onLoad
   */
  onLoad() {
    let _this = this;

    _this.setData({appGlobalData: APP.globalData});
    APP.authInitedCallback = function() {
      _this.setData({appGlobalData: APP.globalData});
    };
  },

  /**
   * onShow
   */
  onShow() {
    this.setData({appGlobalData: APP.globalData});
    if (this.data.appGlobalData.isAuth) this.refreshUserInfo();
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
   * goto 用户登录页
   */
  gotoAuthPage() {
    this.pageRouter.navigateTo({url: '../auth/index'});
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

  /**
   * logoutHandler
   */
  logoutHandler() {
    let _this = this;

    wx.showModal({
      title: '提示',
      content: '确认要退出登录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({title: '正在退出登录'});

          APP.AUTH.userLogout().then(function() {
            wx.showModal({
              title: '你已安全地退出登录',
              showCancel: false,
            });
          }).catch(function() {
            wx.showModal({
              title: '你已退出登录',
              showCancel: false,
            });
          }).finally(function() {
            _this.setData({appGlobalData: APP.globalData});
            wx.hideLoading();
          });
        }
      },
    });
  }
});
