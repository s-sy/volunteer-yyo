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
    indextab:0,
    taskList:app.globalData.taskTypeList,
    startminutevalue:"2020-12-31 08:00",
    endminutevalue:"2020-12-31 20:00",
    latitude:0,
    longitude:0,
    locate:false,   //是否需要定位打卡 0为否 1为是
    isAuthLocation:true,
    locationName:'',
    myTaskList:[],
  },
  showModal() {
    this.setData({
      modalName:'Modal'
    });
  },
  changeTab(e){
    let index=e.currentTarget.dataset.index;
   // console.log(index);
    if(index ==1){
      this.getMytask()
    }
    this.setData({
      indextab:index
    })
  },
  hideModal() {
    this.setData({
      modalName:"",
    })
  },
  getMytask(){
    let that=this;
    app.api.getMyTask("/list").then((res)=>{
      console.log("-------------------")
      console.log(res);
      if(res.ok){
        that.setData({
          myTaskList:res.data
        })
      }
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
          longitude: res.longitude,
          locationName:res.name?res.name:res.address
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
   
    if(this.data.name==""||
    this.data.address==""||
    this.data.card==""||
    this.data.legal==""||
    this.data.phone==""){
      
      this.showModal();
      return;
     
    }

  let startValue=new Date(this.data.startminutevalue.replace(/-/g, '/'));
  let endValue=new Date(this.data.endminutevalue.replace(/-/g, '/'));
  console.log("startValue:"+startValue)
  console.log("endValue:"+endValue)
  let beginTime =new Date(+new Date(startValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
  let endTime =new Date(+new Date(endValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,''); 

 
  // (new Date(new Date().setDate(new Date().getDate() +3)))
  if( (new Date(endTime.replace(/-/g, '/'))).getTime() < (new Date(beginTime.replace(/-/g, '/'))).getTime() || (new Date(beginTime.replace(/-/g, '/'))).getTime() < (new Date()).getTime()){
    wx.showToast({
      title: '活动开始时间必须大于当前时间，请重新选择。',
      duration:3000,
      icon:'none'
    })
    return;
    }
    if(this.data.locate){
      if(this.data.latitude==0 || this.data.longitude==0){
        wx.showToast({
          title: '选择打卡地址有误',
          duration:1000,
          icon:'none'
        })
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

    let that=this;
    let startTime=(new Date(+new Date()+8*3600*1000 +(1000*60*60*24)*3)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    let endTime=(new Date(+new Date()+8*3600*1000 +(1000*60*60*24)*4)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
    console.log(startTime)
    that.setData({
      startminutevalue:(startTime || '').substring(0,16),
      endminutevalue:(endTime || '').substring(0,16)
    })
    // startminutevalue:"2020-12-31 08:00",
    // endminutevalue:"2020-12-31 20:00",
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