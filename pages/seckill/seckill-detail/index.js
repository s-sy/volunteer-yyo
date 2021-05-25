/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const WxParse = require('../../../public/wxParse/wxParse.js')
const app = getApp()
const util = require('../../../utils/util.js')
Page({
  data: {
    seckillInfo: {},
    disabled: false,
    parameter: {},
    shareShow: '',
    curLocalUrl: '',
    userInfo: null,
    modalRule: '',
    seckillHallInfoId: "",
    specInfo: "",
    cutPercent: "",
    canCutPrice: "",
    havCutPrice: "",
    posterUrl: "",
    posterShow: false,
    posterConfig: "",
    article_description: "",
    hasBargainUser: false, //是否存在砍价数据
    bargainUserId: '',
    curHour: 0,
    outTime: -1,
    nextCountDown: -1,//如果该商品详情是暂未开始的商品那么获取自动启动倒计时
  },
  onShow() {
  },
  onLoad(options) {
    let seckillHallInfoId
    if (options.scene) {//接受二维码中参数
      seckillHallInfoId = decodeURIComponent(options.scene)
    } else {
      seckillHallInfoId = options.seckillHallInfoId
    }
    this.setData({
      seckillHallInfoId: seckillHallInfoId,
      curHour: new Date().getHours()
    })
    app.initPage().then(res => {
      this.seckillInfoGet()
    });
  },
  onShareAppMessage: function () {
    let seckillInfo = this.data.seckillInfo
    let title = seckillInfo.shareTitle
    let imageUrl = seckillInfo.picUrl
    let path = ''
    path = 'pages/seckill/seckill-detail/index?seckillHallInfoId=' + this.data.seckillHallInfoId
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //查询秒杀详情
  seckillInfoGet() {
    app.api.seckillInfoGet(this.data.seckillHallInfoId).then(res => {
      res.data.goodsSpu.freightTemplat = res.data.goodsSpu.freightTemplat? res.data.goodsSpu.freightTemplat : {}
      if(res.data.seckillHall){
        let hallHour = Number(res.data.seckillHall.hallTime);
        let nowDate = new Date()
        let curDate = nowDate.getFullYear()+'-'+util.formatNumber(nowDate.getMonth()+1)+'-'+util.formatNumber(nowDate.getDate());
        // 必须当前日期和当前时间相同才能进行秒杀
        if(curDate==res.data.seckillHall.hallDate){
          // 计算倒计时时间
          let curDateTime = new Date().getTime();//当前时间
          if(hallHour==this.data.curHour){
            let nextHour = hallHour + 1;
            let nextDateTime = res.data.seckillHall.hallDate + ' ' + nextHour + ':00:00';
            let timeTemp = new Date(nextDateTime).getTime();
            this.setData({
              outTime: new Date(timeTemp).getTime() - curDateTime//下一个整点时间
            })
          } else if(hallHour>this.data.curHour){
            //还未开始的也要启动倒计时，例如，当我59进到该详情页面时不能秒杀购买，但是在该页面等一分钟后该商品应该自动变为可以秒杀购买
            let startDateTime = res.data.seckillHall.hallDate + ' ' + hallHour + ':00:00';
            let timeTemp = new Date(startDateTime).getTime();
            let nextCountDown = new Date(timeTemp).getTime() - curDateTime;//下一个整点时间
            this.setData({
              outTime: 0,
              nextCountDown: nextCountDown/1000
            })
            var that = this;
            let timer = setInterval(function() {//启动倒计时
              that.nextCountDown--
              if (that.data.nextCountDown == 0) {
                //结束,刷新
                clearInterval(timer);
                that.seckillInfoGet();
              }
            }, 1000);
          }
        }
      }
      let specInfo = '';
      res.data.goodsSku.specs.forEach(function(specItem, index) {
        specInfo = specInfo + specItem.specValueName;
        if (res.data.goodsSku.specs.length != index + 1) {
          specInfo = specInfo + ';';
        }
      });
      this.setData({
        specInfo: specInfo,
        seckillInfo: res.data
      })
      //html转wxml
      WxParse.wxParse('description', 'html', res.data.goodsSpu.description, this, 0)
      setTimeout(() => {
        this.setData({
          article_description: this.data.seckillInfo.goodsSpu ? this.data.seckillInfo.goodsSpu.description:''
        })
      }, 300);
    });
  },
  //立即秒杀
  toSeckillBuy(e) {
    let seckillInfo = this.data.seckillInfo;
    if (this.data.outTime<1) {
      wx.showToast({
        title: '当前时间不能发起秒杀！',
        icon: 'none'
      })
      return;
    }
    let goodsSpu = seckillInfo.goodsSpu;
    let goodsSku = seckillInfo.goodsSku;
    if (goodsSku.stock > 0) {
      /* 把参数信息异步存储到缓存当中 */
      wx.setStorage({
        key: 'param-orderConfirm',
        data: [{
          spuId: goodsSpu.id,
          skuId: goodsSku.id,
          quantity: 1,
          salesPrice: seckillInfo.seckillPrice,
          spuName: goodsSpu.name,
          specInfo: this.data.specInfo,
          picUrl: goodsSku.picUrl ? goodsSku.picUrl : goodsSpu.picUrls[0],
          freightTemplat: goodsSpu.freightTemplat,
          weight: goodsSku.weight,
          volume: goodsSku.volume,
          orderType: '3',
          marketId: seckillInfo.id,
          relationId: seckillInfo.seckillHall.id
        }]
      });
      wx.navigateTo({
        url: '/pages/seckill/seckill-order-confirm/index'
      });
    } else {
      wx.showToast({
        title: '秒杀商品库存不足',
        icon: 'none',
        duration: 2000
      });
    }
  },
  ruleShow() {
    this.setData({
      modalRule: 'show'
    })
  },
  ruleHide() {
    this.setData({
      modalRule: ''
    })
  },
  countDownDone() {
    this.seckillInfoGet();
  },
  shareShow() {
    this.setData({
      shareShow: 'show'
    })
  },
  shareHide() {
    this.setData({
      shareShow: ''
    })
  },
  onPosterSuccess(e) {
    const { detail } = e
    this.setData({
      posterUrl: detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  hidePosterShow() {
    this.setData({
      posterShow: false,
      shareShow: ''
    })
  },
  /**
   * 异步生成海报
   */
  onCreatePoster() {
    app.api.qrCodeUnlimited({
      page: 'pages/seckill/seckill-detail/index',
      scene: this.data.seckillHallInfoId
    })
      .then(res => {
        let base64 = res.data
        base64src(base64, res => {
          let qrCode = res
          //海报配置请参考 https://github.com/jasondu/wxa-plugin-canvas
          let posterConfig = {
            width: 750,
            height: 1280,
            backgroundColor: '#fff',
            debug: false,
            blocks: [
              {
                width: 690,
                height: 808,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                borderRadius: 20,
              },
              {
                width: 634,
                height: 74,
                x: 59,
                y: 770,
                backgroundColor: '#fff',
                opacity: 0.5,
                zIndex: 100,
              },
            ],
            texts: [
              {
                x: 30,
                y: 113,
                baseLine: 'top',
                text: this.data.seckillInfo.shareTitle,
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: this.data.seckillInfo.goodsSpu.name,
                width: 570,
                lineNum: 1,
                color: '#080808',
                zIndex: 200,
              },
              {
                x: 59,
                y: 895,
                baseLine: 'middle',
                text: [
                  {
                    text: '拼团价',
                    fontSize: 28,
                    color: '#ec1731',
                  },
                  {
                    text: '¥' + this.data.seckillInfo.seckillPrice,
                    fontSize: 36,
                    color: '#ec1731',
                    marginLeft: 30,
                  }
                ]
              },
              {
                x: 522,
                y: 895,
                baseLine: 'middle',
                text: '原价 ¥' + this.data.seckillInfo.goodsSku.salesPrice,
                fontSize: 28,
                color: '#929292',
              },
              {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [
                  {
                    text: this.data.seckillInfo.goodsSpu.sellPoint,
                    fontSize: 28,
                    color: '#929292',
                    width: 570,
                    lineNum: 1,
                  }
                ]
              },
              {
                x: 360,
                y: 1065,
                baseLine: 'top',
                text: '长按识别小程序码',
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 360,
                y: 1123,
                baseLine: 'top',
                text: '快来和我一起拼一单吧！',
                fontSize: 28,
                color: '#929292',
              },
            ],
            images: [
              {
                width: 634,
                height: 634,
                x: 59,
                y: 210,
                url: this.data.seckillInfo.picUrl,
              },
              {
                width: 220,
                height: 220,
                x: 92,
                y: 1020,
                url: qrCode,
              }
            ]
          }
          let wxUser = app.globalData.wxUser
          if (wxUser && wxUser.headimgUrl) {//如果有头像则显示
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
            Poster.create(false);    // 入参：true为抹掉重新生成
          })
        })
      })
  },
  //点击保存到相册
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
})