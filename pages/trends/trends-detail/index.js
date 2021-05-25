// pages/trends/trends-detail/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    newtrend:{},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
        if(options.data){
          this.setData({
            newtrend:JSON.parse(options.data)
          })
        }
        console.log(this.data.newtrend)

        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#ff0000',
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
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