// pages/task/taskdetail/index.js
const app=getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    obj:{},
    imgData:[],
    type:'',
    longitude:0,
    latitude:0,
    isAuthLocation:true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      if(options.obj){
        this.setData({
          obj:JSON.parse(options.obj)
        })
        console.log(this.data.obj)
      }
      if(options.type){
        this.setData({
          type:options.type
        })
      }
      // this.checkSetting()
  },
 
  commit(){
    console.log(this.data.isAuthLocation)
    console.log(this.data.obj.locate)
    let that=this;
   
    if(this.data.obj.locate=='1'){
         wx.getLocation({
        type:'gcj02',
        success(res){
          console.log(res);
          that.setData({
            longitude: res.longitude,
            latitude:res.latitude
          })
         that.createpunchin()
        },
        fail(){
          that.setData({
            isAuthLocation:false
          })
        //  wx.showModal({
       
        //    cancelText: '取消',
        
        //    confirmText: '确定',
        //    content: '您未授权位置，请删除小程序重新打开',
         
        //    title: '提示',
        //    success: (result) => {},
        //    fail: (res) => {},
        //    complete: (res) => {},
        //  })
        }
      })
    }else{
      that.createpunchin()
    }
   
 
  },
  bindopensetting(e){
    console.log("=====")
    console.log(e)
   if(e.detail.authSetting['scope.userLocation']==true) {
   this.setData({
    isAuthLocation:true
   })
   
   }
  },
  createpunchin(){
    if(this.data.imgData.length==0){
      wx.showToast({
        title: '没有打卡图片',
        duration:1500,
        icon:'none'
      })
      return ;
    }
    let data= {
      assignmentId:this.data.obj.assignmentId,
      picUrls: this.data.imgData,
      latitude:this.data.latitude,
      longitude:this.data.longitude,
      createId:getApp().globalData.wxUser.mallUserId
    };
   
   
    console.log(data);
   
    app.api.createPunchin(data).then((res)=>{
      console.log(res)
      if(res.ok){
        wx.showToast({
          title: '打卡成功',
          duration:1000,
          icon:'none'
        })
      }
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);
    })
  },
  deleteTeamImg(e){
    let index =e.currentTarget.dataset.index;
    let imgData=[].concat(this.data.imgData);
     imgData.splice(index,1);
     this.setData({
      imgData:imgData
     })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  teamOnLoadImg(){
    let that=this;
   
    wx.chooseImage({
      count: 3-that.data.imgData.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
         console.log(res)
         let tempFilePaths = res.tempFilePaths
        that.qiniuupload(0,tempFilePaths,tempFilePaths.length)
      
         }
    })
  },
  qiniuupload(i,data,length){
    let that=this;
    console.log(data)
    wx.uploadFile({
      filePath: data[i],
      // files:data,
      name: 'file',
      url: app.api.uploadImage,
      formData: {
        'dir':'material',
        'fileType':'image',
        },
      header: {
        "content-type":"multipart/form-data",
        'app-id': wx.getAccountInfoSync().miniProgram.appId,
        'third-session': getApp().globalData.thirdSession != null ? getApp().globalData.thirdSession : ''
      },
      
      success: (result)  =>{
        
        console.log(result)
        let imgss= that.data.imgData;
        imgss.push(JSON.parse(result.data).link)
        that.setData({
          imgData: imgss
        });
       
        
        i=i+1
        if(i<length){
          that.qiniuupload(i,data,length)
        }
     
      },
      fail: (res) =>{
        console.log(res)
      },
      complete: (res) => {
       
      },
    })
   
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