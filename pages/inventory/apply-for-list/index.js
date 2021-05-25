const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    applyForList: []
  },
  onLoad: function (options) {
    app.initPage()
      .then(res => {
        this.getApplyForList()
      })
  },
  getApplyForList() {
    app.api.getApplyForList(Object.assign(
      {},
      this.data.page,
    ))
      .then(res => {
        let applyForList = res.data.records
        this.setData({
          applyForList: applyForList
        })
      })
  }
})