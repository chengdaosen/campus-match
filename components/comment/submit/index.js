

const app = getApp();
Component({

  /**
   * 引入外部样式
   */
  externalClasses: ['extra-class'],

  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    sourceType:"", //样式
    content: "",
    globalData: "", //全局数据
    title: "",//默认标题
    image: "", //默认头像
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: async function (options) {
      let self = this;
      let { guid, logo, title, type, sourceType, replyName } = JSON.parse(decodeURIComponent(options.uriData));
      self.setData({
        sourceType,
        guid,
        type,
        title,
        logo,
        replyName: replyName? ("@" + replyName + "： ") : "",
      });
      //console.log(app.globalData)
    },
    textareaCtrl: function (e) {
      if (e.detail.value) {
        this.setData({
          content: e.detail.value
        })
      } else {
        this.setData({
          content: ""
        })
      }
      console.log(this.data.content);
    },
    /**
     * 提交数据
     */
    commentSubmit: async function () {
      let self = this;
      let { content, guid, sourceType, replyId } = this.data;
      if (content) {
        if(!self.submitLock){
          self.submitLock = true;
          //这里只是demo，届时可以替换成 对应的请求
          let result = { status: "success"};
          if (result.status == "success"){
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                setTimeout(function () {
                  self.submitLock = false;
                  wx.navigateBack();
                  app.globalData.commentRefresh = true;
                }, 2000)
              }
            })
          }else {
          }
        }
      } else {
        util.showToast('请填写内容！', "fail");
      }
    }
  }
});