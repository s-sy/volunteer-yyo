// pages/user/user-publish/index.js
const app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName:"",
    name:"",
    address:"",
    
    legal:"",
    card:0,
    phone:"",
    poits:"",
    introduction:"",
    taskType:"",
    index: 0,
    taskList:app.globalData.taskTypeList,
    startminutevalue:"2020-12-31 08:00",
    endminutevalue:"2020-12-31 20:00",
    latitude:0,
    longitude:0,
    locate:false,   //是否需要定位打卡 0为否 1为是
    isAuthLocation:true,
  },
  showModal() {
    this.setData({
      modalName:'Modal'
    });
  },
  hideModal() {
    this.setData({
      modalName:"",
    })
  },
  inputName(e){ //公司名称
    console.log(e);
    
    this.setData({
      name:e.detail.value
    })
  },
  bindPickerChange(e){
    console.log(e)
    this.setData({
      index: e.detail.value
    })
   
  },
  inputTaskType(e){
    this.setData({
      taskType:e.detail.value
    })
  },
  inputAddress(e){ //公司地址
    this.setData({
      address:e.detail.value
    })
  },
  inputLegal(e){  //法人姓名
    this.setData({
      legal:e.detail.value
    })
  },
  inputCard(e){  //身份证号码
    this.setData({
      card:e.detail.value
    })
  },
  inputPhone(e){ //联系电话
    this.setData({
      phone:e.detail.value
    })
  },
  inputPoits(e){
    this.setData({
      poits:e.detail.value
    })
  },
  textareaAInput(e){ //简介
    this.setData({
      introduction:e.detail.value
    })
    
  },
  switchChange(e){
    this.setData({
      locate: e.detail.value
    })
    
  },
  startChangeMinute(e){
    this.setData({ startminutevalue: e.detail.value})
  },
  endChangeMinute(e){
    this.setData({endminutevalue: e.detail.value})
  },
  chooseMap(){
    let that=this;
    wx.chooseLocation({
      success(res){
        console.log(res);
        that.setData({
          latitude:  res.latitude,
          longitude: res.longitude
        })
        
      },
      fail(e){
      
        console.log(e)
        that.setData({
          isAuthLocation:false
        })
      }
    })
  },
  bindopensetting(e){
    let that=this;
    console.log(e)
    if(e.detail.authSetting['scope.userLocation']==true){
      that.setData({
        isAuthLocation:true
      })
    }
  },
  onClient(){
   wx.showModal({
   
     cancelText: 'cancelText',
    
     confirmText: 'confirmText',
     content: 'content',
    
     title: 'title',
     success: (result) => {},
     fail: (res) => {},
     complete: (res) => {},
   })
  },
  onCommit(){
   

  let startValue=new Date(this.data.startminutevalue);
  let endValue=new Date(this.data.endminutevalue);
    
  let beginTime =new Date(+new Date(startValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  let endTime =new Date(+new Date(endValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''); 

  if(this.data.name==""||
  this.data.address==""||
  this.data.card==""||
  this.data.legal==""||
  this.data.phone==""){
    
    this.showModal();
    return;
   
  }
  
    if((new Date(endTime)).getTime()<(new Date(beginTime)).getTime()|| (new Date(beginTime)).getTime()<(new Date()).getTime()){
      this.showModal(); 
    return;
    }
    if(this.data.locate){
      if(this.data.latitude==0||this.data.longitude==0){
        this.showModal(); 
        return;
      }
      
  }
    let data={
      publisherId:getApp().globalData.wxUser.mallUserId,
      topic:this.data.name,
      address:this.data.address,
      contacts:this.data.legal,
      numberNeeded:this.data.card,
      phone:this.data.phone,
      // poits:this.data.poits,
      details:this.data.introduction,
      
      taskType:this.data.index,
      latitude:this.data.latitude,
      longitude:this.data.longitude,
      locate:this.data.locate?"1":"0",   //是否需要定位打卡 0为否 1为是
      beginTime:beginTime,
      endTime:endTime,
     
    };
    console.log(data);
    
    app.api.publishTask(data).then((res)=>{
      if(res.ok){
        wx.showToast({
          title: '成功提交',
          duration: 1500,
          icon: 'none',
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        // wx.showToast({
        //   title: '提交失败，联系管理员',
        //   duration:2000,
        //   icon:'none'
        // })
      }

    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log("456")
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