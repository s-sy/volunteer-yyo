// components/newtask/home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskType:{
      type:String,
      value:"",
    },
    taskData:{
      type:Object,
      value:{}
    },
    myConformity:{
      type:Number,
      value:-1
    }
  },
 
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的初始数据
   */
  data: {
    taskTypeList:getApp().globalData.taskTypeList,
    startTime:'',
    endTime:'',
    showBoutton:'none',
    isNow:false,
    delayClock:'',
    overdue:'none',
  },
  attached(){
   // console.log("________________________")
   let overdue='none';
    let obj=this.data.taskData
    let startTime=(obj.beginTime || '').substring(0,16)
    let endTime=(obj.endTime || '').substring(0,16)
   // console.log(this.data.taskData)
    let showBoutton="none";
    overdue=obj.overdue;
    if(this.data.taskType=='user'){
        let nowTime= (new Date()).getTime()
        let start = (new Date(obj.beginTime.replace(/-/g, '/'))).getTime()
        let end = (new Date(obj.endTime.replace(/-/g, '/'))).getTime()
    
     
        if(nowTime<start){
          showBoutton='before';
        }
        if(nowTime>=start && nowTime<=end){
          showBoutton='now'
        }
        if(nowTime>end){
          showBoutton='after';
             console.log(nowTime)

       console.log(end)
       console.log(3*24*3600*1000)
          if(nowTime<(end+(getApp().globalData.delayClock || 0)*24*3600*1000)){
          
            this.setData({
              delayClock:true
            })
          }else{
            this.setData({
              delayClock:false
            }) 
          }
        }
    }
    let isNow=false;
    if(this.data.taskType=='index'){
      let nowTime= new Date().getTime()
      let start =new Date(obj.beginTime.replace(/-/g, '/')).getTime()
      let end =new Date(obj.endTime.replace(/-/g, '/')).getTime()
      if(start<nowTime && nowTime<end){
        isNow=true
      }
    }
   // console.log(showBoutton)
    this.setData({
      startTime:startTime,
      endTime:endTime,
      showBoutton:showBoutton,
      isNow:isNow,
      overdue:overdue,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jumpDetail(e){
      let type = e.currentTarget.dataset.type;
      let data= e.currentTarget.dataset.data;
      console.log(data)
      if((type=='now' && data.overdue !="1")||(type=='after' && this.data.delayClock && data.overdue !="1") ){
        
        wx.navigateTo({
          url: '/pages/task/taskdetail/index?obj='+JSON.stringify(data)+'&type='+type,
        })
      }else{
      
        wx.navigateTo({
          url: '/pages/task/registration/index?obj='+JSON.stringify(data)+'&type='+type+'&taskType='+this.data.taskType,
        })
       }
       
        
     
    },
    jumpRejDetail(e){
     
      let data= e.currentTarget.dataset.data;
    
       
        wx.navigateTo({
          url: '/pages/task/registration/index?obj='+JSON.stringify(data)+'&taskType=index',
        })
        
      
     
    }
  }
})
