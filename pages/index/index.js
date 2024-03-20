const { myRequest } = require('../../utils/service')
Page({
  data: {
    value: '',
    commentList: [],  //帖子列表
    commentTypeIndex: 0, //评论类型选择的index
    commentType: ["最热", "最新"],
    refresh: false
  },
  onSearch() {
    console.log('搜索了')
  },
  //获取帖子内容
  getPosts() {
    myRequest({
      url: '/posts',
      method: 'GET',
    }).then((res) => {
      this.setData({
        commentList: res.data,
        refresh: true
      });
    })
  },
  // 页面显示时触发
  onShow() {
    this.getPosts()
    // 在页面显示时修改底部导航栏状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
  //更新评论类型数据请求
  bindPickerChange (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let index = e.detail.value;
    //查看评论类型对应的key
    let commentKey = ["like", "time"];
    this.setData({
        commentTypeIndex: index,
        currentType: commentKey[index],
        //isOver: false,
        p: 1
    })
},
})
