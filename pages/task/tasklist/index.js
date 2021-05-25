const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    page: {
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: '',
      
    },
    deliveryPoints:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    app.initPage()
    .then(res => {
      this.loadData()
    })
  },
  loadData(){
    this.list()
  },
  list() {
    let that=this;
    app.api.listAssignmentPage(Object.assign(
      {
        auditStatus:'1'
      },
      this.data.page))
    .then(res => {
      console.log(res)
      if (res.ok && res.data != null) {
        let list = res.data.ipage.records
        that.setData({
          deliveryPoints: list,
        })
      } else{
       //
      }
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