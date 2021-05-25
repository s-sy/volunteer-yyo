/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
/**
 * <version>2.8.8</version>
 */
import api from './utils/api'

App({
  api: api,
  globalData: {
    thirdSession: null,
    sessionKeyss:null,
    wxUser: null,
    taskTypeList:['义务劳动','好人好事'],
    delayClock:"",
  },
  onLaunch: function () {
    //检测新版本
    this.updateManager()
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    //     let capsule = wx.getMenuButtonBoundingClientRect();
		// if (capsule) {
		//  	this.globalData.Custom = capsule;
		// 	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		// } else {
		// 	this.globalData.CustomBar = e.statusBarHeight + 50;
		// }
      }
    })
  },
  updateManager(){
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        },
        fail(){},
      })
    })
  },
  //获取购物车数量
  shoppingCartCount() {
    this.api.shoppingCartCount()
      .then(res => {
        let shoppingCartCount = res.data
        this.globalData.shoppingCartCount = shoppingCartCount + ''
        // wx.setTabBarBadge({
        //   index: 2,
        //   text: this.globalData.shoppingCartCount + ''
        // })
      })
  },
  //初始化，供每个页面调用 
  initPage: function () {
    let that = this
    return new Promise((resolve, reject) => {
      if (!that.globalData.thirdSession) {//无thirdSession，进行登录
        that.doLogin()
          .then(res => {
            resolve("success")
          })
      } else {//有thirdSession，说明已登录，返回初始化成功
        resolve("success")
      }
    })
  },
  doLogin(){
    wx.showLoading({
      title: '登录中',
    })
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            api.login({
              jsCode: res.code
            })
              .then(res => {
                wx.hideLoading({
                  success(){},
                  fail(){},
                })
                let wxUser = res.data
                console.log("_++++++++++++++++++++++++++")
                console.log(wxUser)
                that.globalData.thirdSession = wxUser.thirdSessionKey
                that.globalData.sessionKey = wxUser.sessionKey
                that.globalData.wxUser = wxUser
                resolve("success")
                //获取购物车数量
                that.shoppingCartCount()
              })
          }
        }
      })
    })
  },
  //获取当前页面带参数的url
  getCurrentPageUrlWithArgs(){
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options
    let urlWithArgs = `/${url}?`
    for (let key in options) {
      const value = options[key]
      urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  }
})