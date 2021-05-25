// pages/user/user-honour/index.js
const app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   user:"",
   userInfo:"",
   userId:"",
   userList:[],
   brs:'',
   unitName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.id)
      {
        this.setData({
          userId:options.id,
          userInfo:getApp().globalData.wxUser
        })
      }else{
        this.setData({
          userId:getApp().globalData.wxUser.mallUserId,
          userInfo:getApp().globalData.wxUser
        })
      }
    
   
      
  },
  getdatalist(id){
    let that=this;
   app.api.getUserHonour(id).then((res)=>{
     console.log(res)
     let brs= (res.data.birthday || '').substring(0,10)
     that.setData({
      user: res.data,
      brs:brs
     })
     that.getUnitList()
   })
  },
  getUserHonourImgList(id){
    let that=this;
    app.api.getUserHonourImgList(id).then((res)=>{
      console.log(res)
      that.setData({
        userList: res.data
       
       })
    })
  },
  getUnitList(){
    let that=this;
    app.api.getUnitList().then((res)=>{
      console.log(res)
      let str="";
  
      for(let i=0 ;i<res.data.length;i++){
        if(res.data[i].id==that.data.user.unitId){
            str=res.data[i].name
        }
      }
      that.setData({
        unitName:str
      })
     
    })
  },
  changeData(){
    if(this.data.user.id!=this.data.userInfo.mallUserId){
      return;
    }
    wx.navigateTo({
      url: '../user-honour-update/index?user='+JSON.stringify(this.data.user),
    })
  },
  tohonour(){
    if(this.data.user.id!=this.data.userInfo.mallUserId){
      return;
    }
    wx.navigateTo({
      url: '../user-honour-updateimg/index?userList='+JSON.stringify(this.data.userList),
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
    this.getdatalist(this.data.userId)
    this.getUserHonourImgList(this.data.userId)
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