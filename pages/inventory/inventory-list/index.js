const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    page: {
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: '',
    },
    goodsSpuList: [],
    sourcingList: [],
    isShowFrom: '',
    tmpNumber: 0,
    currentDepId: '',
    currentSourcingId: '',
    currentSkuName: ''
  },
  onLoad() {
    app.initPage()
      .then(res => {
        this.getSourcingList()
        // this.getGoodsSpuList()
      })
  },
  getGoodsSpuList() {
    let _this = this 
    app.api.getGoodsSpuList()
      .then(res => {
        let goodsSpuList = res.data
        // let tmpList = res.data
        // let goodsSpuList = []
        // if (tmpList.length > 0) {
        //   tmpList.forEach(element => {
        //     app.api.getGoodsSkuList(element.id)
        //     .then(res => {
        //       let tmpSkuList = res.data
        //       element.goodsSkuList = tmpSkuList
        //       goodsSpuList.push(element);
        //     })
        //   });
        // } 
        _this.setData({
          goodsSpuList: goodsSpuList
        })

        // _this.getSourcingList()
      })
  },
  getSourcingList() {
    let _this = this
    app.api.getSourcingList()
      .then(res => {
        let sourcingList = res.data
        _this.setData({
          sourcingList: sourcingList
        })
      })
  },
  addSoucring(e) {
    let _this = this
    let spuId = e.currentTarget.dataset.spuid
    let skuId = e.currentTarget.dataset.skuid
    let deliveryPointId = e.currentTarget.dataset.depid
    app.api.saveSourcing({
      deliveryPointId: deliveryPointId,
      spuId: spuId,
      skuId: skuId
    })
    .then(res => {
      wx.showToast({
        title: '添加成功',
        icon: 'none',
        duration: 3000
      })
      _this.hideModal()
      _this.getSourcingList()
    })
  },
  showModal(e) {
    //default DrawerModalL
    let modalName = e.currentTarget.dataset.target
    if (modalName === 'DrawerModalL') {
      this.getGoodsSpuList()
      
    } else if (modalName === 'DialogModal1'){
      this.setData({
        currentDepId: e.currentTarget.dataset.depid,
        currentSourcingId: e.currentTarget.dataset.sourcingid,
        currentSkuName: e.currentTarget.dataset.skuname
      })
    }
    this.setData({
      modalName: modalName
    })
    
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      tmpNumber: 0
    })
  },
  showFrom(e){
    let param = e.target.dataset.param; 
    let _this = this
    app.api.getGoodsSkuList(param)
      .then(res => {
        let goodsSkuList = res.data
        let tmpList = [];
        _this.data.goodsSpuList.forEach(element => {
          if (element.id === param) {
            element.goodsSkuList = goodsSkuList
          }
          tmpList.push(element)
        })
        _this.setData({
          goodsSpuList: tmpList,
          isShowFrom: param
        })
      })
    // this.setData({ 
    //   isShowFrom1: param == 1 ? (!this.data.isShowFrom1) : false,
    // });
    
  },
  sliderChange(e) {
    this.setData({
      tmpNumber: e.detail.value
    })
  },
  replenishment() {
    let _this = this
    app.api.saveApplyFor({
      deliveryPointId: this.data.currentDepId,
      createId: app.globalData.wxUser.mallUserId,
      sourcingId: this.data.currentSourcingId,
      skuName: this.data.currentSkuName,
      applicationQuantity: this.data.tmpNumber
    }
    )
      .then(res => {
        wx.showToast({
          title: '申请成功，等待审核。',
          icon: 'none',
          duration: 3000
        })
        _this.hideModal()
      })
  }

})