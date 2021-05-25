/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: 'sort',
      //升序字段
      descs: ''
    },
    parameter: {},
    loadmore: true,
    listSeckillGoodsInfo: [],//当前时间场次的秒杀商品集合
    seckillList: [],
    curSeckillHall: {//当前会场

    },
    outTime: -1,
    TabCur: 0,
    scrollLeft: 0,
    color: 'red',
    loading: false,
    modalName: '',
    active: false,
    curHour: 0 //当前小时
  },
  onShow() {
    
  },
  onLoad(options) {
    this.setData({
      curHour: new Date().getHours()
    })
    app.initPage().then(res => {
      this.seckillhallList();
    });
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.seckillhallList();
    }
  },

  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.refresh(); // 隐藏导航栏加载框

    wx.hideNavigationBarLoading(); // 停止下拉动作

    wx.stopPullDownRefresh();
  },

  countDownDone() {
    this.seckillhallList();
  },
  seckillhallList() {
    let nowDate = new Date()
    let curDate = nowDate.getFullYear()+'-'+util.formatNumber(nowDate.getMonth()+1)+'-'+util.formatNumber(nowDate.getDate());
    let that = this;
    app.api.seckillhallList(curDate).then(res => {
      let seckillList = res.data;
      let hasSeckill = false;
      this.setData({
        loadmore: false,
        seckillList: seckillList
      })
      seckillList.forEach((item,index)=>{
        if(item.hallTime==that.data.curHour){//默认设置当前小时的秒杀时间，如果没有就设置最近时间的秒杀时间
          this.setData({
            curSeckillHall: item,
            TabCur: index,
            scrollLeft: index * 60
          })
          hasSeckill = true;
          this.getSeckillGoodsData(item.id);
          return;
        }else if(!hasSeckill&&item.hallTime>that.data.curHour){//秒杀时间必须大于当前时间
          this.setData({
            curSeckillHall: item,
            TabCur: index,
            scrollLeft: index * 60
          })
          hasSeckill = true;
          this.getSeckillGoodsData(item.id);
          return;
        }
      })
      if(!hasSeckill){
        this.setData({
          curSeckillHall: seckillList[0]
        })
        this.getSeckillGoodsData(this.data.curSeckillHall.id);
      }
      this.setCountDown();
    });
  },
  setCountDown(){
    // 设置倒计时时间，
    // 如果当前时间大于会场时间，结束
    // 如果当前时间等于，正在进行中
    // 如果小于暂未开始
    if(this.data.curSeckillHall.hallTime<this.data.curHour){
      this.setData({
        outTime: 0
      })
    }else if(this.data.curSeckillHall.hallTime==this.data.curHour){//计算倒计时多少秒
      let curDateTime = new Date().getTime();//当前时间
      let nextHour = Number(this.data.curHour) + 1;
      let nextDateTime = this.data.curSeckillHall.hallDate + ' ' + nextHour + ':00:00';
      let timeTemp = new Date(nextDateTime).getTime();
      this.setData({
        outTime: new Date(timeTemp).getTime() - curDateTime//下一个整点时间
      })
    }else{
      this.setData({
        outTime: -1
      })
    }
  },
  tabSelect(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      TabCur:  index,
      curHour: new Date().getHours(),
      scrollLeft: (index - 1) * 60,
      listSeckillGoodsInfo: []
    })
    let item = this.data.seckillList[index]
    if(item){
      item.listSeckillInfo = item.listSeckillInfo? item.listSeckillInfo:[];
      this.setData({
        curSeckillHall: item
      })
      this.getSeckillGoodsData(item.id);
    }else{
      this.setData({
        curSeckillHall: {
          listSeckillInfo: [],
          outTime:0
        }
      })
    }
    this.setCountDown();
  },
  getSeckillGoodsData(id){
    app.api.seckillinfoPage(Object.assign({seckillHallId:id}, this.data.page, this.data.parameter)).then(res => {
      let listSeckillGoodsInfo = res.data.records;
      this.setData({
        listSeckillGoodsInfo: [...this.data.listSeckillGoodsInfo, ...listSeckillGoodsInfo]
      })
      if (listSeckillGoodsInfo.length < this.data.page.size) {
        this.setData({
          loadmore: false
        })
      }
    });
  },
  refresh() {
    this.loadmore = true;
    this.seckillList = [];
    this.listSeckillGoodsInfo = [];
    this.page.current = 1;
    this.seckillhallList();
  }

})