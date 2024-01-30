Page({
  onLoad(){
    console.log('进入初始页面')
    let user = wx.getStorageSync('user')
    console.log(user)
  }
})
