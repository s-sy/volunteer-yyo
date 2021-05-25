// pages/preach/preach-detail/index.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pageCur:"",
    date: '2020-12-20',
    obj:{},
    unit:"",
    contact:"",
    phone:"",
    address:"",
    name:"",
    context:"",
    rate:5,
    modalName:"",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if(options.obj){
      let obj=JSON.parse(options.obj);
      this.setData({
        obj:obj
      });
      console.log(obj);
    }
        if(options.pageCur){
        
          this.setData({
            pageCur:options.pageCur
          })
        }
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
  DateChange(e) {  //日期选择
    this.setData({
      date: e.detail.value
    })
  },
  contactInput(e){  //联系人
    this.setData({
      contact:e.detail.value
    });
  },
  phoneInput(e){
    this.setData({
      phone:e.detail.value
    });
  },
  bindUnitInput(e){  //单位
    this.setData({
      unit:e.detail.value
    });
  },
  textareaBInput(e){
    this.setData({
      address:e.detail.value
    });
  },
  sendOrder(){  //申请派送
    if(this.data.unit==""||this.data.contact=="" ||this.data.address==""){
      this.showModal();
      return;
    }
    let dateValue=new Date(this.data.date);
    
    let time =new Date(+new Date(dateValue)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
   // console.log(time);
    
   let data ={
    createId:app.globalData.wxUser.id,
    civilizationPreachId:this.data.obj.id,
    units:this.data.unit,
    referenceTime:time,
    contacts:this.data.contact,
    phone:this.data.phone,
    preachAddress:this.data.address,
    //auditStatus:"0", //0未审核 1通过 2拒绝
   };
   console.log(data);
    app.api.saveInvited(data).then(res=>{
      console.log(res);
      if(res.ok==true){

        wx.showToast({
          title: '邀请成功',
          duration: 1500,
          icon: 'none',
         
          success: (res) => {
            
          },
          fail: (res) => {},
          complete: (res) => {},
        })
       setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
          success: (res) => {
            
          },
          fail: (res) => {},
          complete: (res) => {
            
          },
        })
       },1000);
       
      }else{
        wx.showToast({
          title: '错误500请联系管理人员',
          duration: 3000,
          icon: 'none',
          
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    })
  },
  // formatTime(date) {
  //   var year = date.getFullYear()
  //   var month = date.getMonth() + 1
  //   var day = date.getDate()
    
  //   var hour = date.getHours()
  //   var minute = date.getMinutes()
  //   var second = date.getSeconds()
    
  //   return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  //  },
  bindNameInput(e){ //姓名
    this.setData({
      name:e.detail.value
    });
  },
  getRate(e){
    console.log(e);
    this.setData({
     rate:e.detail.value
    })
    
    
  },
  textareaCInput(e){
    this.setData({
      context:e.detail.value
    });
  },
  sendComment(){
    if(this.data.context==""){
      this.showModal();
      return;
    }
    let data={
      createId:app.globalData.wxUser.id,
      invitedPreachId:this.data.obj.id,
      preachScore: parseInt(this.data.rate), //评分
      evaluationContent:this.data.context,
    };
    
   console.log(data);
    app.api.saveEvaluation(data).then(res=>{
      console.log(res);
      if(res.ok==true){
        wx.showToast({
          title: '评论成功',
          duration: 1500,
          icon: 'none',
         
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }else{
        wx.showToast({
          title: '错误500，请联系管理人员',
          duration: 3000,
          icon: 'none',
          
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
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