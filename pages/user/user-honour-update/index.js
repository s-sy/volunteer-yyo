// pages/user/user-honour-update/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    name:"",
    date:"2010",
    picker:[],
    index:0,
    textarea:"",
    workunit:"",
    unitId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.user){
        let user=JSON.parse(options.user)
        this.setData({
          user:user,
          name:user.realName,
          textarea:user.description,
          date:(user.birthday || '2010').substring(0,10),
          unitId:user.unitId,
        })
      }
      console.log(this.data.user)
      this.getUnitList()
  },
  getUnitList(){
    let that=this;
    app.api.getUnitList().then((res)=>{
      console.log(res)
      let index=-1;
      for(let i=0 ;i<res.data.length;i++){
        if(res.data[i].id==that.data.unitId){
          index=i
        }
      }
      that.setData({
        picker:res.data,
        index:index
      })
    })
  },
  inputName(e){
    this.setData({
      name:e.detail.value
    })
    
  },
  DateChange(e){
    console.log(e)
    this.setData({
      date:e.detail.value
    })
    
  },
  PickerChange(e){
    console.log(e)
    let index = e.detail.value
this.setData({
 index:index
})
  },
  textareaBInput(e){
    this.setData({
      textarea:e.detail.value
    })
  },
  commit(){
    let endValue= new Date(this.data.date)
    let endTime =new Date(+new Date(endValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  let data={
    id:this.data.user.id,
    realName:this.data.name,
    birthday:endTime,
    description:this.data.textarea,
    unitId:this.data.picker[this.data.index].id
  };
  console.log(data);
 
  app.api.updateHonourText(data).then((res)=>{
    console.log(res)
    if(res.ok){
    wx.showToast({
      title: '修改成功',
      duration: 1000,
      icon: 'none',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000);
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