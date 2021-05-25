const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    imgList:[
      
      "../../../static/preach-img/0.png",
      "../../../static/preach-img/1.png", 
      "../../../static/preach-img/2.png",
       "../../../static/preach-img/3.png", 
      "../../../static/preach-img/4.png",
       "../../../static/preach-img/5.png", 
       "../../../static/preach-img/6.png",
       "../../../static/preach-img/7.png", 
      "../../../static/preach-img/8.png",
       "../../../static/preach-img/9.png", 
      "../../../static/preach-img/10.png",
      ],
      titleData:[],

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    app.initPage()
    .then(res => {
      this.getDataList();
    })
    
  },
  method :{
    
  },
  toList:function(e){
    console.log("222")
    console.log(e)
   let str= e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../preach-list/index?query='+str,
    })
  },
  getDataList(){
    app.api.listClassification().then(res=>{
      console.log(res);
      if(res.ok==true){
        this.setData({
          titleData:res.data
        })
      }
     
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