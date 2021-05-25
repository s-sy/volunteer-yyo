// pages/user/user-team/index.js
 const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    classification:'1',
    imgData:[],
    teamImgData:[],
    name:"",
    address:"",
    legal:"",
    card:"",
    phone:"",
    introduction:"",
    modalName:"",
    myTeam:{},
  },
  changeTab(e){
    let index=e.currentTarget.dataset.index;
   // console.log(index);
    if(index ==1){
      this.getMyteam()
    }
    this.setData({
      index:index
    })
  },
  todetail(e){
   let data= e.currentTarget.dataset.data;

    wx.navigateTo({
      url: '../user-team-detail/index?data='+JSON.stringify(data),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getClassification(e){ //分类
   // console.log(e)
    this.setData({
      classification :e.detail.value
    })
    
  },
  inputName(e){ //公司名称
   // console.log(e);
    
    this.setData({
      name:e.detail.value
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
  textareaAInput(e){ //简介
    this.setData({
      introduction:e.detail.value
    })
    
  },
  onLoadImg(){   // 营业执照
    let that=this;
   
    wx.chooseImage({
      count: 1-that.data.imgData.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
       //  console.log(res)
         let tempFilePaths = res.tempFilePaths
         let imgList=that.data.imgData
        // console.log(getApp().globalData.thirdSession)
     
        that.qiniuupload(0,tempFilePaths,tempFilePaths.length,1)
      
         }
    })

  },
  teamOnLoadImg(){
    let that=this;
   
    wx.chooseImage({
      count: 3-that.data.teamImgData.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
         //console.log(res)
         let tempFilePaths = res.tempFilePaths
        that.qiniuupload(0,tempFilePaths,tempFilePaths.length,2)
      
         }
    })
  },
  qiniuupload(i,data,length,type){
    let that=this;
    
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
        
       if(type==1){
        let imgss= that.data.imgData;
        imgss.push(JSON.parse(result.data).link)
        that.setData({
          imgData: imgss
        });
       }else{
        let imgss= that.data.teamImgData;
        imgss.push(JSON.parse(result.data).link)
        that.setData({
          teamImgData: imgss
        });
       }
        
        i=i+1
        if(i<length){
          that.qiniuupload(i,data,length)
        }
     
      },
      fail: (res) =>{
       // console.log(res)
      },
      complete: (res) => {
       
      },
    })
   
  },
  deleteImg(e){
    
     let index=e.currentTarget.dataset.index;
    // console.log(index);
     let imgData=[].concat(this.data.imgData)
      imgData.splice(index,1)
     this.setData({
      imgData:ImageData
     })
  },
  deleteTeamImg(e){
    let index=e.currentTarget.dataset.index;
    //console.log(index);
   let imgData= [].concat(this.data.teamImgData)
   imgData.splice(index,1)
   this.setData({
    teamImgData:imgData
   })
    
  },
  onCommit(){
  
    if(this.data.name==""||this.data.address==""||this.data.legal=="" ||this.data.card==""||this.data.phone==""){
      this.showModal()
      return;
    }
    let data={
   
      classification:this.data.classification, //分类1、单位/企业 2、民间团体不能为空"
   
      createId:getApp().globalData.wxUser.mallUserId, // 创建者ID
      name:this.data.name,//名称
      address:this.data.address,//地址
      principal:this.data.legal,//联系人
      phone:this.data.phone, //手机号码
      businessLicense:this.data.imgData[0],//营业执照
      teamNumber:this.data.card,//组织总人数
      introduction:this.data.introduction,//介绍
      picUrls:this.data.teamImgData,//组织展示图片组
    };
    app.api.createTeam(data).then((res)=>{
    //  console.log(res);
      if(res.ok==true){
        wx.showToast({
          title: '提交审核成功',
          icon:'none',
          duration:1500,
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },1500)
      }
    })

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
  getMyteam(){  //我的team
    let that=this;
    app.api.getMyteam().then((res)=>{
      // console.log(res)
       if(res.ok){
         that.setData({
          myTeam:res.data
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