// pages/registration/index.js
const app=getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    obj:{},
    taskTypeList:getApp().globalData.taskTypeList,
    startTime:'',
    endTime:'',
    isReg:false,
    regId:'',
    type:'none',
    taskType:'',
    isNow:false,
    overdue:'',
    wxUser:{},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      let that=this;
      if(options.obj){
        let obj =JSON.parse(options.obj)
        let startTime=(obj.beginTime || '').substring(0,16)
        let endTime=(obj.endTime || '').substring(0,16)
        
       
        this.setData({
          obj:obj,
          startTime:startTime,
          endTime:endTime,
         
        })
        console.log(this.data.obj)
      }
      let isNow=false;
      if(options.taskType){
        
        if(options.taskType=='index'){
          let obj = that.data.obj;
          let nowTime= (new Date()).getTime()
          let start = (new Date(obj.beginTime.replace(/-/g, '/'))).getTime()
          let end = (new Date(obj.endTime.replace(/-/g, '/'))).getTime()
          if(start<nowTime && nowTime<end){
            isNow=true
          }
        }
        this.setData(
          {
            taskType:options.taskType,
            isNow:isNow
          }
        )
        
      }
      console.log("=================================="+isNow)
      if(options.type){
      this.setData({
        type:options.type
      })
      }
      // console.log("type+++++++++++++++"+options.type)
      // this.setData({
      //   wxUser:getApp().globalData.wxUser
      // })
      console.log(this.wxUser)
      this.getPersonalList()
      this.getwxUserGet();
  },
  getwxUserGet(){
    let that=this;
    app.api.wxUserGet().then((res)=>{
      console.log("+++++++++++++++++++++++++++++++++++++")
      console.log(res)
      if(res.ok){
        getApp().globalData.wxUser=res.data
        that.setData({
          wxUser:res.data
        })
      }
     
    })
  },
  getPersonalList(){
    let that=this;
    app.api.listRegistrationByPersonal({
      enrolledId: app.globalData.wxUser.mallUserId,
      attendFlag: '0'
    })
    .then(res => {
      console.log(res)

      if (res.ok && res.data != null) {
        console.log()
        let list=res.data;
        // let nowDate = new Date().getTime();
        // for(let j=0;j<res.data.length;j++){ 
        //    let endDate = new Date(res.data[j].endTime.replace(/-/g,'/')).getTime()
        //    if(nowDate<endDate){
        //      list.push(res.data[j])
        //    }
        // }
        console.log("查看list")
         console.log(list)
        let isReg = false;
        let regId="";
        let overdue="";
       for(let i =0;i<list.length;i++){
         if(that.data.taskType=='user'){
          if(list[i].id==that.data.obj.id){
            isReg=true;
            regId=list[i].id;
            overdue=list[i].overdue;
          } 
         }else{
          if(list[i].assignmentId==that.data.obj.id){
            isReg=true;
            regId=list[i].id;
            overdue=list[i].overdue;
          }
         }
       }
       console.log(that.data.obj.id)
       console.log(isReg);
       console.log("regId:"+regId)
        that.setData({
          isReg:isReg,
          regId:regId,
          overdue:overdue,
        })
      } else{
       //
      }
    })
  },
  getPhone(e){
      let that=this;
      if(e.detail.errMsg=="getPhoneNumber:ok"){  //用户点击了一个
        let encryptedData=e.detail.encryptedData; 
        let iv=e.detail.iv;
       
        app.initPage()
        .then(res => {
          let session_key=getApp().globalData.sessionKey;
          that.sendphoneNumber(encryptedData,session_key,iv) 
        })
        
      }else{
        return;
      }
  },
  sendphoneNumber(encryptedData,session_key,iv){
    let that=this;
						let data={
							encryptedData:encryptedData,
							session_key:session_key,
							iv:iv
            };
           // console.log(data)
						//  data.encryptedData=encryptedData;
						//  data.session_key=session_key;
						//  data.iv=iv
              //console.log(encryptedData+'\n'+session_key+'\n'+iv)
              // console.log("+++++")
              // app.api.getPhones(data).then((res)=>{
             
             
              // });
							wx.request({
								url: 'https://ad.tmyomi.com/yomi/api/yo/userinfo/phone', //仅为示例，并非真实接口地址。
								method:'POST',
								data: data,
								timeout:120000,
								header: {
								  'app-id': wx.getAccountInfoSync().miniProgram.appId,
								  'third-session': getApp().globalData.thirdSession
								},
								success:(res)=> {
					
									if(res.errMsg=="request:ok"){
									getApp().globalData.wxUser = res.data   //成功获取手机缓存到wxUser
									that.setData({
                    wxUser : res.data
                  })

									}
								}
							})
  },
  register(){  //报名
    let id =this.data.obj.id
   app.api.registration(id).then((res)=>{
     console.log(res)
     
     if(res.ok){
       wx.showToast({
         title: '报名成功',
         duration: 1000,
         icon: 'none',
         
       })
       setTimeout(()=>{
         wx.navigateBack({
           delta: 1,
           
         })
       },1000)

     }
   })
  },
  nuRegister(){ //取消报名
    let id = this.data.regId;
    console.log("取消报名"+id)
    wx.showModal({
     
      cancelText: '取消',
      
      confirmText: '确认',
      content: '取消报名后将不能再次报名',
     
      title: '提示',
      success: (result) => {
       
        if(result.confirm==true){

          app.api.cannelRegistration(id).then((res)=>{
            console.log(res)
            if(res.ok){
              let title= res.data=='true'?'取消成功':res.data;
              wx.showToast({
                title: title,
                duration:1000,
                icon:'none'
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              },1000)
            }
          })
        }
       
       
      },
      fail: (res) => {},
      complete: (res) => {},
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