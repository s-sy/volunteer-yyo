// pages/user/user-honour-updateimg/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    inputNames:"",
    imgData:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let id = getApp().globalData.wxUser.mallUserId
    this.getUserHonourImgList(id)
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
  inputName(e){
    console.log(e)
    this.setData({
      inputNames:e.detail.value
    })
  },
  upload(){
    let that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        console.log(res)
        let tempFilePaths = res.tempFilePaths[0];
        that.qiniuupload(tempFilePaths)
      }
    })
  },
  qiniuupload(filePath){
    let that=this;
    
    wx.uploadFile({
      filePath: filePath,
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
        that.setData({
         imgData: JSON.parse(result.data).link
        })
        console.log(result)
      },
      fail: (res) =>{
        console.log(res)
      },
      complete: (res) => {
       
      },
    })
   
  },
  commit(){
    if(this.data.name="" || this.data.imgData==""){
      wx.showToast({
        title: '数据不完整，请检查',
        duration: 1000,
        icon: 'none',
     
      })
      return;
    }
    console.log(this.data.inputNames)
    let data={
      userId:getApp().globalData.wxUser.mallUserId,
      type:'1',
      designation:this.data.inputNames,
      picUrls:this.data.imgData
    };
    console.log(data);
   
    app.api.createHonour(data).then((res)=>{
    console.log(res)
    if(res.ok){
      wx.showToast({
        title: '提交成功',
        duration: 1000,
        icon: 'none',
      });
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
    }
  })

  },
  delethonour(e){
    let that=this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    wx.showModal({
     
      cancelText: '取消',
   
      confirmText: '确定',
      content: '您确定要删除此条荣誉吗',
    
      title: '提示',
      success: (result) => {
        app.api.deleteHonour(id).then((res)=>{
          console.log(res)
          if(res.ok){
            wx.showToast({
              title: '成功删除',
              duration:2000,
              icon:'none',
            })
            let id = getApp().globalData.wxUser.mallUserId
            that.getUserHonourImgList(id)
          }
        })
      },
      fail: (res) => {},
      complete: (res) => {},
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