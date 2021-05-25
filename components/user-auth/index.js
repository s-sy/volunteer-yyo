/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const app = getApp()
Component({
  properties: {
    switchOn: {
      type: Boolean,
      value: true
    },
  },
  data: {
    wxUser: null
  },
  lifetimes: {
    // 组件所在页面的生命周期函数
    ready: function () {
      this.setData({
        wxUser: app.globalData.wxUser
      })
    }
  },
  methods: {
    agreeGetUser(e) {
      if (e.detail.errMsg == 'getUserInfo:ok') {
        app.api.wxUserSave(e.detail)
          .then(res => {
            let wxUser = res.data
            this.setData({
              wxUser: wxUser
            })
            app.globalData.wxUser = wxUser
          })
      }
    },
  }
})