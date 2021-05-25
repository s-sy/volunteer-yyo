// pages/preach/preach-list/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    query:"",
    dataList:[],
  },
  
  onClickT(e){
    console.log(e);
    let str=e.currentTarget.dataset.text;
    let index=e.currentTarget.dataset.index;
    // if(str=="order"){}
    console.log(index);
   

  let obj = JSON.stringify(this.data.dataList[index]);

    // if(str=="comment"){}
    wx.navigateTo({
      url: '../preach-detail/index?pageCur='+str+'&obj='+obj,
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      

      if(options.query){
        this.setData({
          query:options.query
        })
        this.getListData(options.query);
      }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  getListData(id){
    app.api.classificationByList(id).then(res=>{
      console.log(res);
      if(res.ok==true)
      this.setData({
        dataList:res.data
      })
    });
   
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