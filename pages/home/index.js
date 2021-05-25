//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    swiperData: [],
    noticeData: [],
    taskTitle:{url:"/static/img/biaoti@2x.png",name:"最新任务",jump:"/pages/task/tasklist/index",},
    newTitle:{url:"/static/img/xinwen@2x.png",name:"新闻动态",jump:"/pages/trends/trends-list/index",},
    paiTitle:{url:"/static/img/paihang@2x.png",name:"志愿者积分排行榜",jump:"/pages/rank/index",},
    ranking:[],
    newstrends:[],
    taskList:[],
    barList:[
      {
        url:"/static/img/icon1@2x.png",
        name:"任务列表",
        tag:'/pages/task/tasklist/index',
      },
      {
        url:"/static/img/icon2@2x.png",
        name:"报名任务",
        tag:'/pages/task/user-task/index'
      },
      {
        url:"/static/img/icon3@2x.png",
        name:"积分兑换",
        tag:'/pages/shop/index'
      },
      {
        url:"/static/img/icon5@2x.png",
        name:"创建队伍",
        tag:'/pages/user/user-team/index',
      },
      {
        url:"/static/img/icon6@2x.png",
        name:"寻求帮助",
        tag:'/pages/task/task-help/index',
      }
    ],
    page: {
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'points_total',  
    },
    trendPage:{
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'create_time',  
    },
    taskPage: {
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: '',
      
    },
   
  },
  //事件处理函数
  todetail(e){
      console.log(e)
      let index= e.currentTarget.dataset.index;
      let page=e.currentTarget.dataset.data.tag;
      if(index==1||index==2){
        wx.switchTab({
          url: page
        })
      }else{
        wx.navigateTo({
          url: page,
        })
      }
  },
  onLoad() {
    app.initPage()
      .then(res => {
        this.loadData()
      })
  },
  onShow(){
    // app.initPage()
    // .then(res => {
      
    // })
    if(getApp().globalData.thirdSession){
      this.loadData()
    }
  },
  loadData(){
    this.swiperGet()
    this.noticeGet()
    this.rankingGet()
    this.newstrendsGet()
    this.taskListGet()
    this.pointsConfigGet()
//
  },
  pointsConfigGet() {
    app.api.pointsConfigGet()
      .then(res => {
        console.log("查看过期参数")
        console.log(res)
        // this.setData({
        //   pointsConfig: res.data
        // })
        app.globalData.delayClock=res.data.delayClock
      })
  },
  taskListGet(){
    let that=this;
    app.api.listAssignmentPage(Object.assign(
      {
        auditStatus:'1'
      },
      this.data.taskPage))
    .then(res => {
     // console.log(res)
      if (res.ok && res.data != null) {
        let list = res.data.ipage.records
        that.setData({
          taskList: list,
        })
      } else{
       //
      }
    })
  },
  torenddetail(e){
let data= e.currentTarget.dataset.data;
wx.navigateTo({
  url: '/pages/trends/trends-detail/index?data='+JSON.stringify(data),
 
})
  },
  newstrendsGet(){
    let that=this;
    app.api.newstrendsGet(
      Object.assign(
          {},
          this.data.trendPage)
    ).then((res)=>{
     // console.log(res);
      if(res.ok){
        that.setData({
          newstrends:res.data.records
        })
       
      }
     
    })
  },
  toList(){
    
  },
  onShareAppMessage: function () {
    let title = '幺米社区'
    let path = 'pages/home/index'
    return {
      title: title,
      path: path,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取轮播图
  swiperGet() {
    app.api.noticeGet({
      type: '1',
      enable: '1'
    })
      .then(res => {
        let notice = res.data
        if (notice){
          this.setData({
            swiperData: notice.listNoticeItem
          })
        }
      })
  },
  //获取广告通知
  noticeGet() {
    app.api.noticeGet({
      type: '2',
      enable: '1'
    })
      .then(res => {
        let notice = res.data
        if (notice) {
          this.setData({
            noticeData: notice.listNoticeItem
          })
        }
      })
  },
  //积分排名
  rankingGet(){
    let that=this;
    app.api.rankingGet(
      Object.assign(
          {},
          this.data.page)
    ).then((res)=>{
     // console.log(res);
      if(res.ok){
        that.setData({
        ranking:res.data.records
        })
       
      }
     
    })
  },
})
