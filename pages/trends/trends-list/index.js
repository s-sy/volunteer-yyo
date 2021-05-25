const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    trendPage:{
      current: 1,
      size: 100,
      ascs: '',//升序字段
      descs: 'create_time',  
    },
    newstrends:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.newstrendsGet()
  },
  newstrendsGet(){
    let that=this;
    app.api.newstrendsGet(
      Object.assign(
          {},
          this.data.trendPage)
    ).then((res)=>{
      console.log(res);
      if(res.ok){
        that.setData({
          newstrends:res.data.records
        })
       
      }
     
    })
  },
  todetail(e){
    let data= e.currentTarget.dataset.data;
    
    wx.navigateTo({
      url: '../trends-detail/index?data='+JSON.stringify(data),
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

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