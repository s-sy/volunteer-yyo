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
    orderInfo: {
      type: Object,
      value: {}
    },
    callPay: {
      type: Boolean,
      value: false
    },
    contact: {
      type: Boolean,
      value: false
    }
  },
  data: {
    loading: false
  },
  ready() {
    let that = this
    setTimeout(function () {
      if (that.data.callPay) {
        that.unifiedOrder()
      }
    }, 1000)
  },
  methods: {
    orderReceive(){
      let that = this
      wx.showModal({
        content: '是否确认收货吗？',
        cancelText: '我再想想',
        confirmColor: '#ff0000',
        success(res) {
          if (res.confirm) {
            let id = that.data.orderInfo.id
            app.api.orderReceive(id)
              .then(res => {
                that.triggerEvent('orderReceive', res)
              })
          }
        }
      })
    },
    orderCancel() {
      let that = this
      wx.showModal({
        content: '确认取消该订单吗？',
        cancelText: '我再想想',
        confirmColor: '#ff0000',
        success(res) {
          if (res.confirm) {
            let id = that.data.orderInfo.id
            app.api.orderCancel(id)
              .then(res => {
                that.triggerEvent('orderCancel', res)
              })
          }
        }
      })
    },
    orderDel() {
      let that = this
      wx.showModal({
        content: '确认删除该订单吗？',
        cancelText: '我再想想',
        confirmColor: '#ff0000',
        success(res) {
          if (res.confirm) {
            let id = that.data.orderInfo.id
            app.api.orderDel(id)
              .then(res => {
                that.triggerEvent('orderDel', res)
              })
          }
        }
      })
    },
    unifiedOrder() {
      this.setData({
        loading: true
      })
      var that = this
      let orderInfo = this.data.orderInfo
      app.api.unifiedOrder({
        id: orderInfo.id
      })
        .then(res => {
          this.setData({
            loading: false
          })
          if (orderInfo.paymentPrice <= 0){//0元付款
            that.triggerEvent('unifiedOrder', res)
          }else{
            let payData = res.data
            wx.requestPayment({
              'timeStamp': payData.timeStamp,
              'nonceStr': payData.nonceStr,
              'package': payData.packageValue,
              'signType': payData.signType,
              'paySign': payData.paySign,
              'success': function (res) {
                that.triggerEvent('unifiedOrder', res)
              },
              'fail': function (res) {

              },
              'complete': function (res) {
                console.log(res)
              }
            })
          }
        }).catch(() => {
          this.setData({
            loading: false
          })
        })
    },
    urgeOrder() {
      wx.showToast({
        title: '已提醒卖家发货',
        icon: 'success',
        duration: 2000
      })
    },
    orderLogistics(){
      wx.navigateTo({
        url: '/pages/order/order-logistics/index?id=' + this.data.orderInfo.orderLogistics.id
      })
    },
    orderAppraise(){
      wx.navigateTo({
        url: '/pages/appraises/form/index?orderId=' + this.data.orderInfo.id
      })
    },
    orderVerification(){
      wx.navigateTo({
        url: '/pages/order/order-detail/index?id=' + this.data.orderInfo.id
      })
    //   app.api.qrCodeUnlimited({
    //     page: 'pages/home/index',
    //     scene: this.data.orderInfo.id
    //   })
    //     .then(res => {
    //       let qrCode = res
    //       //海报配置请参考 https://github.com/jasondu/wxa-plugin-canvas
    //       let posterConfig = {
    //         width: 750,
    //         height: 1280,
    //         backgroundColor: '#fff',
    //         debug: false,
    //         blocks: [
    //           {
    //             width: 690,
    //             height: 808,
    //             x: 30,
    //             y: 183,
    //             borderWidth: 2,
    //             borderColor: '#f0c2a0',
    //             borderRadius: 20,
    //           },
    //           {
    //             width: 634,
    //             height: 74,
    //             x: 59,
    //             y: 770,
    //             backgroundColor: '#fff',
    //             opacity: 0.5,
    //             zIndex: 100,
    //           },
    //         ],
    //         texts: [
    //           {
    //             x: 30,
    //             y: 113,
    //             baseLine: 'top',
    //             text: this.data.grouponInfo.shareTitle,
    //             fontSize: 38,
    //             color: '#080808',
    //           },
    //           {
    //             x: 92,
    //             y: 810,
    //             fontSize: 38,
    //             baseLine: 'middle',
    //             text: this.data.grouponInfo.goodsSpu.name,
    //             width: 570,
    //             lineNum: 1,
    //             color: '#080808',
    //             zIndex: 200,
    //           },
    //           {
    //             x: 59,
    //             y: 895,
    //             baseLine: 'middle',
    //             text: [
    //               {
    //                 text: '拼团价',
    //                 fontSize: 28,
    //                 color: '#ec1731',
    //               },
    //               {
    //                 text: '¥' + this.data.grouponInfo.grouponPrice,
    //                 fontSize: 36,
    //                 color: '#ec1731',
    //                 marginLeft: 30,
    //               }
    //             ]
    //           },
    //           {
    //             x: 522,
    //             y: 895,
    //             baseLine: 'middle',
    //             text: '原价 ¥' + this.data.grouponInfo.goodsSku.salesPrice,
    //             fontSize: 28,
    //             color: '#929292',
    //           },
    //           {
    //             x: 59,
    //             y: 945,
    //             baseLine: 'middle',
    //             text: [
    //               {
    //                 text: this.data.grouponInfo.goodsSpu.sellPoint,
    //                 fontSize: 28,
    //                 color: '#929292',
    //                 width: 570,
    //                 lineNum: 1,
    //               }
    //             ]
    //           },
    //           {
    //             x: 360,
    //             y: 1065,
    //             baseLine: 'top',
    //             text: '长按识别小程序码',
    //             fontSize: 38,
    //             color: '#080808',
    //           },
    //           {
    //             x: 360,
    //             y: 1123,
    //             baseLine: 'top',
    //             text: '快来和我一起拼一单吧！',
    //             fontSize: 28,
    //             color: '#929292',
    //           },
    //         ],
    //         images: [
    //           {
    //             width: 634,
    //             height: 634,
    //             x: 59,
    //             y: 210,
    //             url: this.data.grouponInfo.picUrl,
    //           },
    //           {
    //             width: 220,
    //             height: 220,
    //             x: 92,
    //             y: 1020,
    //             url: qrCode,
    //           }
    //         ]
    //       }
    //       let wxUser = app.globalData.wxUser
    //       if (wxUser && wxUser.headimgUrl) {//如果有头像则显示
    //         posterConfig.images.push({
    //           width: 62,
    //           height: 62,
    //           x: 30,
    //           y: 30,
    //           borderRadius: 62,
    //           url: wxUser.headimgUrl,
    //         })
    //         posterConfig.texts.push({
    //           x: 113,
    //           y: 61,
    //           baseLine: 'middle',
    //           text: wxUser.nickName,
    //           fontSize: 32,
    //           color: '#8d8d8d',
    //         })
    //       }
    //       this.setData({
    //         posterConfig: posterConfig,
    //         posterShow: true
    //       }, () => {
    //         Poster.create(false);    // 入参：true为抹掉重新生成
    //       })
    //     })
    },
  }
})