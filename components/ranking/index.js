// components/user/home.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ranking:{
      type:Array,
      value:[],
     
    },
    rankingType:{
      type:String,
      value:'',
     
    }
  },

  /**
   * 组件的初始数据
   */
  
  data: {
    userList:[
      
        
      // {
      //   imgUrl:"/static/img/xiaolu.jpg",
      //   name:"不是就不是",
      //   enlist:75,
      //   integral:2551
      // },
      // {
      //   imgUrl:"/static/img/xiaoma.jpg",
      //   name:"往事随风",
      //   enlist:56,
      //   integral:2499
      // },
      // {
      //   imgUrl:"/static/img/xiaoming.jpg",
      //   name:"床前明月光",
      //   enlist:45,
      //   integral:2402
      // },
      // {
      //   imgUrl:"/static/img/xaioba.jpg",
      //   name:"飞流直下三千尺",
      //   enlist:32,
      //   integral:1998
      // }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todetail(e){
      let id = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/user/user-honour/index?id='+id,
      })
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
    //  console.log(this.data)
     },
    hide: function () { },
    resize: function () { },
  },
})
