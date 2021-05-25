/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const WxParse = require('../../../public/wxParse/wxParse.js')
import Poster from '../../../components/wxa-plugin-canvas/poster/poster'
const { base64src } = require('../../../utils/base64src.js')
const app = getApp()

Page({
  data: {
    orderInfo: null,
    id: null,
    callPay: false//是否直接调起支付
  },
  onShow() {
    app.initPage()
      .then(res => {
        this.orderGet(this.data.id)
      })
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    if (options.callPay){
      this.setData({
        callPay: true
      })
    }
  },
  orderGet(id){
    let that = this
    app.api.orderGet(id)
      .then(res => {
        let orderInfo = res.data
        if (!orderInfo){
          wx.redirectTo({
            url: '/pages/order/order-list/index'
          })
        }
        this.setData({
          orderInfo: orderInfo
        })
        setTimeout(function () {
          that.setData({
            callPay: false
          })
        }, 4000)
      })
  },
  //复制内容
  copyData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.data
    })
  },
  orderCancel(){
    let id = this.data.orderInfo.id
    this.orderGet(id)
  },
  orderDel(){
    wx.navigateBack()
  },
  unifiedOrder() {
    this.onShow()
  },
  countDownDone(){
    this.orderGet(this.data.id)
  },
  onPosterSuccess(e) {
    console.log(e)
   
    this.setData({
      posterUrl: e.detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  qrCodeVerification(){
    app.api.qrCodeUnlimited({
      page: 'pages/verification/index',
      scene: this.data.orderInfo.id
    })
      .then(res => {
        let base64 = res.data
        base64src(base64 , res => {
          let qrCode = res
          //海报配置请参考 https://github.com/jasondu/wxa-plugin-canvas
          let posterConfig = {
            width: 750,
            height: 1310,
            backgroundColor: '#fff',
            debug: false,
            blocks: [
              {
                width: 690,
                height: 690,
                x: 30,
                y: 600,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                backgroundColor: '#ffffff',
                borderRadius: 20,
              },
            ],
            texts: [
              // {
              //   x: 60,
              //   y: 650,
              //   baseLine: 'top',
              //   text: '核销时请先确认核销商品库存是否充足，如不足建议更换商品',
              //   fontSize: 30,
              //   color: '#080808',
              // },
            ],
            images: [
              {
                width: 750,
                height: 1310,
                x: 0,
                y: 0,
                url: 'https://img.tmyomi.com/1339477578691645440/material/9477de0b-4600-41ef-a5f4-9542596bc2eb.png',
              },
              {
                width: 350,
                height: 350,
                x: 200,
                y: 740,
                url: qrCode,
              },
              {
                width: 552,
                height: 92,
                x: 99,
                y: 1120,
                url: 'https://img.tmyomi.com/1339477578691645440/material/fb469112-9749-4b14-ae9f-7bda95095780.png',
              }
            ]
          }
          let wxUser = app.globalData.wxUser
          if (wxUser && wxUser.headimgUrl){//如果有头像则显示
            posterConfig.images.push({
              width: 62,
              height: 62,
              x: 30,
              y: 30,
              borderRadius: 62,
              url: wxUser.headimgUrl,
            })
            posterConfig.texts.push({
              x: 113,
              y: 61,
              baseLine: 'middle',
              text: wxUser.nickName,
              fontSize: 32,
              color: '#8d8d8d',
            })
          }
          this.setData({
            posterConfig: posterConfig,
            posterShow: true
          }, () => {
            Poster.create(true,this);    // 入参：true为抹掉重新生成
          })
        })
      })
},
savePoster: function () {
  var that = this
  wx.saveImageToPhotosAlbum({
    filePath: that.data.posterUrl,
    success(res) {
      wx.showModal({
        content: '图片已保存到相册，赶紧晒一下吧~',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#333',
        success: function (res) {
          if (res.confirm) {
            /* 该隐藏的隐藏 */
            that.setData({
              shareShow: ''
            })
          }
        }, fail: function (res) {
          console.log(res)
        }
      })
    }
  })
},
hidePosterShow() {
  this.setData({
    posterShow: false,
    shareShow: ''
  })
},
  
})