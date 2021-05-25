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
    wxUser: null,
    userInfo: null,
    orderCountAll: []
  },
  onShow(){
    //更新tabbar购物车数量
    // wx.setTabBarBadge({
    //   index: 2,
    //   text: app.globalData.shoppingCartCount + ''
    // })
    
    let wxUser = app.globalData.wxUser
    this.setData({
      wxUser: wxUser
    })
    this.userInfoGet()
    this.orderCountAll()
  },
  onLoad(){
  },
  /**
   * 小程序设置
  */
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
  orderCountAll(){
    app.api.orderCountAll()
      .then(res => {
        this.setData({
          orderCountAll: res.data
        })
      })
  }
})
