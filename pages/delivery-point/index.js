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
    // page: {
    //   searchCount: false,
    //   current: 1,
    //   size: 10,
    //   ascs: '',//升序字段
    //   descs: ''
    // },
    // parameter: {},
    deliveryPoints: [],
    select: false
  },
  onLoad(options) {
    if (options.select){
      this.setData({
        select: true
      })
    }
  },
  onShow() {
    app.initPage()
      .then(res => {
        // this.userAddressPage()
        this.getLocation()
        // this.orderFindDeliveryPoint()
      })
  },
  // 获取经纬度
	getLocation() {
		return new Promise((resolve, reject) => {
			const _this = this
			wx.getLocation({
				success(res) {
					if (res.latitude && res.longitude) {
						_this.setData({
							latitude: res.latitude,
							longitude: res.longitude
            })
            _this.orderFindDeliveryPoint()
						resolve(true)
					}
				},
				fail(err) {
					reject(err)
				}
			})
		})
  },
  orderFindDeliveryPoint() {
    let that = this
    wx.getStorage({
      key: 'param-orderConfirm',
      success: function (res) {
        let orderConfirmData = res.data
        let spuIds = null
        let skuIds = null
        let quantitys = null 
        orderConfirmData.forEach((orderConfirm, index) => {
          if (spuIds) {
            spuIds = spuIds + ',' + orderConfirm.spuId
          } else {
            spuIds = orderConfirm.spuId
          }
          if (skuIds) {
            skuIds = skuIds + ',' + orderConfirm.skuId
            quantitys = orderConfirm.quantity +  ',' + quantitys
          } else {
            skuIds = orderConfirm.skuId
            quantitys = orderConfirm.quantity
          }
          
        })
        app.api.deliveryPointAdaptive({
          spuIds: spuIds,
          skuIds: skuIds,
          quantitys: quantitys,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        })
        .then(res => {
          if (res.ok && res.data != null) {
            let deliveryPoints = res.data
            that.setData({
              deliveryPoints: deliveryPoints,
            })
          } else{
           //
          }
        })
      }

  })
},
  selectDeliveryPoint(e){
    if (this.data.select){
      let index = e.currentTarget.dataset.index
      let deliveryPointForm = this.data.deliveryPoints[index]
      var pages = getCurrentPages(); // 获取页面栈
      var currPage = pages[pages.length - 1]; // 当前页面
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        deliveryPoint: deliveryPointForm
      })
      wx.navigateBack()
    }
  }
})
