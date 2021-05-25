// pages/task/task-help/index.js
const app = getApp();
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    helpImgData:[],
    name:"",
    address:"",
    legal:"",
    
    phone:"",
    introduction:"",
    modalName:"",
    page: {
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: '',
    },
    myHelpList:[],
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
  todetail(e){
    let obj = e.currentTarget.dataset.itemobj;
    console.log(e)
    wx.navigateTo({
      url: '../task-help-detail/index?obj='+JSON.stringify(obj),
    })
  },
  changeTab(e){
    let index=e.currentTarget.dataset.index;
    if(index==1){
      this.getMyHelp();
    }
    this.setData({
      index:index
    })
  },
  getMyHelp(){
    app.api.getMyHelp(
      Object.assign(
          {},
          this.data.page)
    ).then((res)=>{
      console.log(res);
      if(res.ok){
        this.setData({
          myHelpList:res.data.records
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
  teamOnLoadImg(){
    let that=this;
   
    wx.chooseImage({
      count: 9-that.data.helpImgData.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
         console.log(res)
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
        
    
        let imgss= that.data.helpImgData;
        imgss.push(JSON.parse(result.data).link)
        that.setData({
          helpImgData: imgss
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
  onCommit(){
    if(this.data.name==""||this.data.address==""||this.data.legal==""||this.data.phone==""||this.data.introduction==""){
      this.showModal();
      return;
    }
    let data={
      publisherId:getApp().globalData.wxUser.mallUserId,
      // picUrls:this.data.helpImgData,
      subject:this.data.name,
      address:this.data.address,
      contacts:this.data.legal,
      phone:this.data.phone,
      details:this.data.introduction,
    };

    console.log(data);
    app.api.createHelp(data).then((res)=>{
      console.log(res);
      if(res.ok){
        wx.showToast({
          title: '提交成功',
          duration: 1000,
          icon: 'none', 
        })
        setTimeout(() => {
         wx.navigateBack({
           delta: 1,
         })
        }, 1000);
        
      }
    });
   
  },
 
})
