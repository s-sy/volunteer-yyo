// pages/rank/index.js
const app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking:[],
    page: {
      current: 1,
      size: 100,
      ascs: '',//升序字段
      descs: 'points_total',  
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.rankingGet()
  },
  rankingGet(){
    let that=this;
    app.api.rankingGet(
      Object.assign(
          {},
          this.data.page)
    ).then((res)=>{
    //  console.log(res);
      if(res.ok){
        that.setData({
        ranking:res.data.records
        })
       
      }
     
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})