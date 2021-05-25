const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    wxUser: null,
    userInfo: null,
    orderCountAll: [],
    index:0,
  },
  toTeam(){
    wx.navigateTo({
      url: '../user-team/index',
    })
  },
  onShow(){
    //更新tabbar购物车数量
    // wx.setTabBarBadge({
    //   index: 2,
    //   text: app.globalData.shoppingCartCount + ''
    // })
    app.initPage()
    .then(res => {
      this.loadData()
    })
   
  },
  loadData(){
    let wxUser = app.globalData.wxUser
    this.setData({
      wxUser: wxUser
    })
    this.userInfoGet()
    this.userIntegration()
    this.orderCountAll()
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },
  settings: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
      }
    })
  },
  agreeGetUser(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.api.wxUserSave(e.detail)
        .then(res => {
          let wxUser = res.data
          this.setData({
            wxUser: wxUser
          })
          app.globalData.wxUser = wxUser
          this.userInfoGet()
        })
    }
  },
  //获取商城用户信息
  userInfoGet(){
    app.api.userInfoGet()
      .then(res => {
        this.setData({
          userInfo: res.data
        })
      })
  },
  userIntegration() {
    app.api.userIntegration()
      .then(res => {
        this.setData({
          userIntegration: res.data
        })
      })
  },
  orderCountAll(){
    app.api.orderCountAll()
      .then(res => {
        this.setData({
          orderCountAll: res.data
        })
      })
  }
})