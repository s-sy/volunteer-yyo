/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    deliveryPoint: {},
    modalTitle: '温馨提醒',
    modalContent: '您的帐号已经关联了提货点。',
    name: '',
    telNum: '',
    districtName: '',
    townName: '',
    villageName: '',
    detailInfo: '',
    longitude: 0,
    latitude: 0,
    locationName:"",
    dorpImg:[],
    isAuthLocation:true,
    isReg:"",
    updateItems:"",
  },
  onLoad(query) {

    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // }); 

    let that = this
    const scene = decodeURIComponent(query.scene)
    console.log(scene)
    let isReg=false;
    app.initPage()
      .then(res => {
        switch (scene) {
          case 'pl':
            that.loadData()
            that.setData({
              isReg:true
            })
            break
          default:
            that.substitution(scene)
            that.setData({
              isReg:false
            })
            break
        }
      })
    

  },
  gettelNum(e){
    console.log(e)
    this.setData({
      telNum:e.detail.value
    })
  },
  getdistrictName(e){
    this.setData({
      districtName:e.detail.value
    })
  },
  getname(e){
    this.setData({
      name:e.detail.value
    })
  },
  gettownName(e){  //乡/镇名
    this.setData({
      townName:e.detail.value
    })
  },
  getdetailInfo(e){
    this.setData({
      detailInfo:e.detail.value
    })
  },
  getvillageName(e){  //村/组名
   this.setData({
    villageName:e.detail.value
   })
  },
  getcola(){
    

    let that=this;
   
   
    wx.chooseLocation({
      type: 'wgs84',
      success (res) {
        console.log(res)
      that.setData({
        latitude: res.latitude,
        longitude:res.longitude,
        locationName:res.name?res.name:res.address
      })
      },
      fail(e){
        console.log("5555555555")
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
  upLoadImg(){
    let that=this;
    wx.chooseImage({
      count:1-that.data.dorpImg.length,
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
    console.log("上传图片中")
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
        let imgss= that.data.dorpImg;
        imgss.push(JSON.parse(result.data).link)
        that.setData({
          dorpImg: imgss
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
  deleteTeamImg(){
    this.setData({
     dorpImg:[]
    })
 },
  loadData(){
    this.deliveryPointGet()
  },
  substitution(scene){
    app.api.substitution(scene)
    .then(res => {
      console.log("查看修改提货点扫码返回")
      console.log(res)
      console.log(typeof  res.data)
      if(typeof res.data=="string"){
        this.setData({
          modalTitle: '温馨提醒',
          modalContent: res.data,
          modalName: 'DialogModal1'
        })
        return;
      }
      if (res.ok && res.data == false) {
        this.setData({
          modalTitle: '温馨提醒',
          modalContent: '无效二维码或无效提货点。',
          modalName: 'DialogModal1'
        })
        return;
      }
      if(res.data){
        let items=res.data
       this.setData({
        // :items.
        updateItems:items,
        name: items.verificationName,
        telNum: items.telNum,
        districtName:items.districtName,
        townName: items.townName,
        villageName: items.villageName,
        detailInfo: items.detailInfo,
        dorpImg:[items.outletUrl]
       }) 
      }
     
    })
  },
  // onShareTimeline(){
  //   // let path = 'pages/home/index'
  //   let title = 'Yomi社区'
  //   return {
  //     title: title,
  //     query: 
  //     {},
  //     imageUrl:""
    
  //     // success: function (res) {
  //     //   // if (res.errMsg == 'shareAppMessage:ok') {
  //     //   //   console.log(res.errMsg)
  //     //   // }
  //     // },
  //     // fail: function (res) {
  //     //   // 转发失败
  //     // }
  //   }
  // },
  onShareAppMessage: function () {
    let title = 'Yomi社区'
    let path = 'pages/home/index'
   

    return {
      title: title,
      path: path,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //热销单品
  deliveryPointGet() {
    app.api.deliveryPointGetOne(app.globalData.wxUser.mallUserId)
      .then(res => {
        console.log(res)
        if (res.ok && res.data == null) {
          this.setData({
            deliveryPoint: res.data ? res.data : {}
          })
        } else{
          this.setData({
            modalTitle: '温馨提醒',
            modalContent: '您的帐号已经关联，请不要多次操作。',
            modalName: 'DialogModal1'
          })
        }
      })
  },
  jumpPage(e){
    let page = e.currentTarget.dataset.page
    if (page){
      wx.navigateTo({
        url: page
      })
    }
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  submitModal(e) {
    this.submitDeliveryPoint(e)
   
  },
  upadtesubmitModal(e){
    let that = this;
    let context="";
    var re = /^1\d{10}$/
    if(!re.test(this.data.telNum)){ 
      wx.showToast({
        title: '请填写正确手机号',
        duration:2000,
        icon:'none',
      })
      return; 
  } 
  
    if(that.data.longitude==0||that.data.name==""||that.data.telNum==""||that.data.detailInfo==""||that.data.dorpImg.length==0){

      context=that.data.longitude==0?"请选择经纬度":(that.data.name==""?"请输入名称":(that.data.telNum==""?"请输入联系电话":(that.data.detailInfo==""?"请输入详细地址":(that.data.dorpImg.length==0?"上传门店图片":""))))
      wx.showToast({
        title: context,
        duration: 1000,
        icon: 'none',
      
      })
      return;
    }
    let updateItems=this.data.updateItems;
    console.log(updateItems);
    let data={
      id:updateItems.id,
      verificationId: app.globalData.wxUser.mallUserId,
      verificationName: that.data.name ,
      telNum: that.data.telNum,
      districtName: that.data.districtName || '',
      townName: that.data.townName || '',
      villageName: that.data.villageName || '',
      detailInfo: that.data.detailInfo ,
      longitude: that.data.longitude ,
      latitude: that.data.latitude ,
      outletUrl:that.data.dorpImg[0],
    }
   
    app.api.updateDeliveryPoint(data).then(res=>{
      console.log(res)
      if(res.data==true &&res.ok){
        wx.showToast({
          title: '修改成功',
          duration:1000,
          icon:'success',
        })
        setTimeout(()=>{
          wx.switchTab({
           url: '/pages/home/index',
         })
        },1000)
      }
    })
  },
  submitDeliveryPoint(e){
    //
    let that = this
    let context="";
    var re = /^1\d{10}$/
    if(!re.test(this.data.telNum)){ 
      wx.showToast({
        title: '请填写正确手机号',
        duration:2000,
        icon:'none',
      })
      return; 
  } 
    if(that.data.longitude==0||that.data.name==""||that.data.telNum==""||that.data.detailInfo==""||that.data.dorpImg.length==0){

      context=that.data.longitude==0?"请选择经纬度":(that.data.name==""?"请输入名称":(that.data.telNum==""?"请输入联系电话":(that.data.detailInfo==""?"请输入详细地址":(that.data.dorpImg.length==0?"上传门店图片":""))))
      wx.showToast({
        title: context,
        duration: 1000,
        icon: 'none',
      
      })
      return;
    }
    let data={
      verificationId: app.globalData.wxUser.mallUserId,
      verificationName: that.data.name ,
      telNum: that.data.telNum,
      districtName: that.data.districtName || '',
      townName: that.data.townName || '',
      villageName: that.data.villageName || '',
      detailInfo: that.data.detailInfo ,
      longitude: that.data.longitude ,
      latitude: that.data.latitude ,
      outletUrl:that.data.dorpImg[0],
    }
  console.log(data);
 
    app.api.addDeliveryPoint(data)
    .then(res => {
      //
      if (res.ok) {
        that.setData({
          modalTitle: '提交成功',
          modalContent: '您的信息已经提交成功，请耐心等候审核通知。'
        })
        that.showModal(e)
      }
    })
  }
})
