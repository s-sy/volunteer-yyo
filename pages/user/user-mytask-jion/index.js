// pages/user/user-mytask-jion/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
        if(options.obj){
          let obj = JSON.parse(options.obj);
          console.log(obj)
          that.getRegList(obj.id);
        }
  },
  callPhone(e){
    console.log(e);
    let phone = e.currentTarget.dataset.phone;
    if(phone==null || phone==""){
      wx.showToast({
        title: '电话号码不正确',
        duration:1000,
        icon:'none',
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber:phone,
      success(){},
      fail(){},
    })
  },
  getRegList(id){
    let that=this;
    app.api.getMyTask("/reglist/"+id).then((res)=>{
      console.log("+++++++++++++++")
      console.log(res);
      that.setData({
        personList:res.data
      })
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