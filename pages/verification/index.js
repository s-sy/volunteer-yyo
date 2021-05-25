const app = getApp()

Page({
  data: {

  },
  onLoad(options) {
    let id
    if (options.scene){//接受二维码中参数
      id = decodeURIComponent(options.scene)
    }else{
      id = options.id
    }
    this.setData({
      id: id
    })
    app.initPage()
      .then(res => {
        this.isDep(id)
        // this.orderGet(id)
      })
  },
  isDep(id){
    let _this = this
    app.api.isDep()
      .then(res => {
        let depInfo = res.data
        if (!depInfo){
          _this.setData({
            modalTitle: '温馨提醒',
            modalContent: '无效的操作权限，请联系管理人员。',
            modalName: 'DialogModal1'
          })
        }
        _this.setData({
          depInfo: depInfo
        })
        _this.orderGet(id)
      })
  },
  orderGet(id){
    let _this = this
    app.api.orderGet(id)
      .then(res => {
        let orderInfo = res.data
        if (!orderInfo){
          _this.setData({
            modalTitle: '温馨提醒',
            modalContent: '订单信息有误，请确认后再次操作。',
            modalName: 'DialogModal1'
          })
          // return
        }
        if (orderInfo.deliveryWay != '2' || orderInfo.status != 8) {
          _this.setData({
            modalTitle: '温馨提醒',
            modalContent: '无效操作订单，请确认后再次操作。',
            modalName: 'DialogModal1'
          })
          // return
        }
        if (orderInfo.deliveryPointId != _this.data.depInfo.id) {
          _this.setData({
            modalTitle: '温馨提醒',
            modalContent: '非本自提点订单，请与客户确认。',
            modalName: 'DialogModal1'
          })
          // return
        }
        _this.setData({
          orderInfo: orderInfo
        })
      })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  orderVerification(){
    let _this = this
    wx.showModal({
      content: '是否确认核销商品？',
      cancelText: '稍后',
      confirmColor: '#ff0000',
      success(res) {
        if (res.confirm) {
          let id = _this.data.orderInfo.id
          app.api.orderVerification(id)
            .then(res => {
              // that.triggerEvent('orderReceive', res)
              _this.setData({
                modalTitle: '温馨提醒',
                modalContent: '商品核销成功，',
                modalName: 'DialogModal1'
              })
            })
        }
      }
    })
  }
})