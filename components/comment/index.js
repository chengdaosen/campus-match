
const utils = require('../../utils/formatTime.js');
const testData = require('json.js');
const testData2 = require('json2.js');
Component({
    /**
     * 引入外部样式
     */
    externalClasses: ['extra-class'],

    /**
     * 组件的属性列表
     */
    properties: {
        //是否要刷新状态
        refresh: {
            type:Boolean,
            value: false,
            observer: "_refresh"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        commentList: [],  //评论列表
        commentTypeIndex: 0, //评论类型选择的index
        //查看评论类型切换
        commentType: ["最佳", "最新", "只看自己"],
        total: 0, //一共多少
        currentType: "like",  //当前类型和状态
        p: 1, //当前页数
        pageSize: 20, //默认每页个数
        maintenance:false, 
        wxLogin:true, // 判断用户是否授权
        commitShowLogin:false, //评论前 是否显示登录弹窗
        num:1
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 更新评论类型数据请求
         * @param {Object} e 对象
         */
        bindPickerChange: function (e) {
            console.log(this._status)
            console.log('picker发送选择改变，携带值为', e.detail.value);
            let self = this;
            let index = e.detail.value;
            //查看评论类型对应的key
            let commentKey = ["like", "time", "user"];
            this.setData({
                commentTypeIndex: index,
                currentType: commentKey[index],
                //isOver: false,
                p: 1
            })
            self._setPageData(commentKey[index]);
        },
        onShow(){
            if(this.data.num == 2){
                this.onLoad(2)
            }

            this.setData({
                num:2
            })
        },
        /**
         * 启动时候加载数据
         */
        onLoad(num) {
            let self = this;
            self._setPageData(num);
        },
        async _setPageData(type = "like", more = false, p = 1, pageSize = 20) {
            let self = this;
            try {
                //请求获取评论列表
                //let result = {status:"success"};
                let result = testData;  //这里改成假数据
                if (type == 2){
                    result = testData2;
                }
                //成功获取列表
                if (result.status == "success") {
                    let commentData = result.data;
                    let likeJson = {};
                    if (commentData) {
                        //建立 like 数据
                        commentData.likes.forEach(element => {
                            likeJson[element] = true;
                        })
                        //清洗数据
                        commentData.comments.forEach((element, index) => {
                            let startTime = new Date(element.createTime);
                            commentData.comments[index].createTime = utils.timeFormat(startTime, "MM月dd日 hh:mm:ss");
                            commentData.comments[index].like = likeJson[element.id] ? true : false;
                            if (element.replyContents.length>0){
                                element.replyContents.forEach((ele, indexReply)=>{
                                    let startTimeReply = new Date(ele.createTime);
                                    commentData.comments[index].replyContents[indexReply].createTime = utils.timeFormat(startTimeReply, "MM月dd日 hh:mm:ss");
                                    commentData.comments[index].replyContents[indexReply].like = likeJson[ele.id] ? true : false;
                                })
                            }
                        });
                        //是否是加载更多行为
                        let newData = "";
                        if (more) {
                            newData = self.data.commentList.concat(commentData.comments);
                        } else {
                            newData = commentData.comments;
                        }
                        self.setData({
                            total: commentData.total,
                            commentList: newData,
                            maintenance: false,
                            p,
                        })
                    }else {
                        self.setData({
                            maintenance: false
                        })
                    }
                }
            } catch (e) {
                console.log(e)
            }
        },
        //设置玩家点赞
        async _clickLike(e) {
            //代码示例，去掉请求
            wx.showToast({
                title: '点赞成功',
                duration: 1000
            })
        },
        /**
         * 点击评论
         * @param {string} e 获取当前数据
         */
        _goToReply(e) {
            let self = this;
            let { contentid, battleTag, replyid } = e.currentTarget.dataset; 
            console.log(e.currentTarget.dataset);
            //判断是否微信授权
            if(!self.data.wxLogin){
                self.setData({
                    commitShowLogin:true
                })
                return false;
            }
            wx.showActionSheet({
                itemList: ['回复', '举报'],
                success: function (res) {
                    if (!res.cancel) {
                        console.log(res.tapIndex);
                        //前往评论 
                        if (res.tapIndex == 0){
                            //判断是否是 评论的评论
                            self._goToComment(replyid, battleTag);
                        }
                        //举报按钮
                        if (res.tapIndex == 1){
                            //弹出框
                            self.setComplain(contentid);
                        }
                    }else {  //取消选择

                    }
                }
            });
        },
        /**
         * 设置举报功能
         * @param {string} contentid 
         */
        setComplain(contentid){
            let complainJson = ["敏感信息", "色情淫秽", "垃圾广告", "语言辱骂", "其它"];
            wx.showActionSheet({
                itemList: complainJson,
                success: async res => {
                    if (!res.cancel) {
                        
                    }
                }
            });
        },
        /**
         * 页面上拉触底事件的处理函数
         */
        _getMore() {
            if (!this.data.maintenance){
                let { currentType, total, p, pageSize } = this.data;
                if ((total / pageSize) > p) {
                    p++;
                    this._setPageData(currentType, true, p)
                } else {
                }
            }  
        },
        /**
         * 跳转去评论
         */
        _goToComment(replyId,replyName) {
            let vType = "";
            let vSource = 'PGC';
            let uriData = {
                logo:"../../../images/a.jpg", 
                guid:"dfsdfsdfsd", 
                type:vType, 
                title:"文章：小程序评论，动态发贴开发指北\n 作者：智酷方程式", 
                sourceType:vSource
            };
            if (replyId && replyName){
                uriData.replyId = replyId;
                uriData.replyName = replyName;
            }
            wx.navigateTo({ url: `/components/comment/submit/index?uriData=${encodeURIComponent(JSON.stringify(uriData))}` });
        },
        /**
         * 隐藏弹窗
         */
        hiddenLoginPop(){
            this.setData({
                commitShowLogin: false
            });
        }
    }
});