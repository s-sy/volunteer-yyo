const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    deliveryPoints:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },
  loadData(){
    this.getPersonalList()
  },
  getPersonalList(){
    let that=this;
    console.log(app.globalData.wxUser)
    app.api.listRegistrationByPersonal({
      enrolledId: app.globalData.wxUser.mallUserId,
      attendFlag: '0'
    })
    .then(res => {
      console.log("任务打卡数据")
      console.log(res)
      if (res.ok && res.data != null) {
        let list = res.data
        that.setData({
          deliveryPoints: list,
        })
      } else{
       //
      }
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
   // this.loadData()
   console.log("任务打卡Onshow")
   app.initPage()
      .then(res => {
        this.loadData()
      })
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})