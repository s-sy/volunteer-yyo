/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.aiforest.net
 * 注意：
 * 本软件为www.aiforest.net开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
import __config from '../config/env'

const request = (url, method, data, showLoading) => {
  let _url = __config.basePath + url
  return new Promise((resolve, reject) => {
    if (showLoading){
      wx.showLoading({
        title: '加载中',
      })
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'app-id': wx.getAccountInfoSync().miniProgram.appId,
        'third-session': getApp().globalData.thirdSession != null ? getApp().globalData.thirdSession : ''
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code != 0) {
            console.log(res.data)
            wx.showModal({
              title: '提示',
              content: res.data.msg + '',
              success() {
                
              },
              complete(){
                if(res.data.code == 60001){
                  //session过期，则清除过期session，并重新加载当前页
                  getApp().globalData.thirdSession = null
                  wx.reLaunch({
                    url: getApp().getCurrentPageUrlWithArgs()
                  })
                }
              }
            })
            reject(res.data.msg)
          }
          resolve(res.data)
        } else if (res.statusCode == 404) {
          wx.showModal({
            title: '提示',
            content: '接口请求出错，请检查手机网络',
            success(res) {

            }
          })
          reject()
        } else {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: res.errMsg + ':' + res.data.message + ':' + res.data.msg,
            success(res) {

            }
          })
          reject()
        }
      },
      fail(error) {
        console.log(error)
        wx.showModal({
          title: '提示',
          content: '接口请求出错：' + error.errMsg,
          success(res) {

          }
        })
        reject(error)
      },
      complete(res) {
        wx.hideLoading({
          success(){},
          fail(){},
        })
      }
    })
  })
}

module.exports = {
  request,
  login: (data) => {//小程序登录接口
    return request('/weixin/api/ma/wxuser/login-yo', 'post', data, false)
  },
  wxUserGet: (data) => {//微信用户查询
    return request('/yomi/api/yo/wxuser', 'get', null, false)
  },
  wxUserSave: (data) => {//微信用户新增
    return request('/yomi/api/yo/wxuser', 'post', data, true)
  },
  goodsCategoryGet: (data) => {//商品分类查询
    return request('/yomi/api/yo/goodscategory/tree' , 'get', data, true)
  },
  goodsPage: (data) => {//商品列表
    return request('/yomi/api/yo/goodsspu/page', 'get', data, false)
  },
  goodsGet: (id) => {//商品查询
    return request('/yomi/api/yo/goodsspu/' + id, 'get', null, false)
  },
  goodsSpecGet: (data) => {//商品规格查询
    return request('/yomi/api/yo/goodsspuspec/tree', 'get', data, true)
  },
  shoppingCartPage: (data) => {//购物车列表
    return request('/yomi/api/yo/shoppingcart/page', 'get', data, false)
  },
  shoppingCartAdd: (data) => {//购物车新增
    return request('/yomi/api/yo/shoppingcart', 'post', data, true)
  },
  shoppingCartEdit: (data) => {//购物车修改
    return request('/yomi/api/yo/shoppingcart', 'put', data, true)
  },
  shoppingCartDel: (data) => {//购物车删除
    return request('/yomi/api/yo/shoppingcart/del', 'post', data, false)
  },
  shoppingCartCount: (data) => {//购物车数量
    return request('/yomi/api/yo/shoppingcart/count', 'get', data, false)
  },
  orderSub: (data) => {//订单提交
    return request('/yomi/api/yo/orderinfo', 'post', data, true)
  },
  orderPage: (data) => {//订单列表
    return request('/yomi/api/yo/orderinfo/page', 'get', data, false)
  },
  orderGet: (id) => {//订单详情查询
    return request('/yomi/api/yo/orderinfo/' + id, 'get', null, false)
  },
  orderCancel: (id) => {//订单确认取消
    return request('/yomi/api/yo/orderinfo/cancel/' + id, 'put', null, true)
  },
  orderReceive: (id) => {//订单确认收货
    return request('/yomi/api/yo/orderinfo/receive/' + id, 'put', null, true)
  },
  orderVerification: (id) => {//订单确认收货
    return request('/yomi/api/yo/orderinfo/verification/' + id, 'put', null, true)
  },
  orderDel: (id) => {//订单删除
    return request('/yomi/api/yo/orderinfo/' + id, 'delete', null, false)
  },
  orderCountAll: (data) => {//订单计数
    return request('/yomi/api/yo/orderinfo/countAll', 'get', data, false)
  },
  orderLogisticsGet: (logisticsId) => {//订单物流查询
    return request('/yomi/api/yo/orderinfo/orderlogistics/' + logisticsId, 'get', null, false)
  },
  unifiedOrder: (data) => {//下单接口
    return request('/yomi/api/yo/orderinfo/unifiedOrder', 'post', data, true)
  },
  userAddressPage: (data) => {//用户收货地址列表
    return request('/yomi/api/yo/useraddress/page', 'get', data, false)
  },
  userAddressSave: (data) => {//用户收货地址新增
    return request('/yomi/api/yo/useraddress', 'post', data, true)
  },
  userAddressDel: (id) => {//用户收货地址删除
    return request('/yomi/api/yo/useraddress/' + id, 'delete', null, false)
  },
  userCollectAdd: (data) => {//用户收藏新增
    return request('/yomi/api/yo/usercollect', 'post', data, true)
  },
  userCollectDel: (id) => {//用户收藏删除
    return request('/yomi/api/yo/usercollect/' + id, 'delete', null, false)
  },
  userCollectPage: (data) => {//用户收藏列表
    return request('/yomi/api/yo/usercollect/page', 'get', data, false)
  },
  goodsAppraisesAdd: (data) => {//商品评价新增
    return request('/yomi/api/yo/goodsappraises', 'post', data, true)
  },
  goodsAppraisesPage: (data) => {//商品评价列表
    return request('/yomi/api/yo/goodsappraises/page', 'get', data, false)
  },
  qrCodeUnlimited: (data) => {//获取小程序二维码
    return request('/weixin/api/ma/wxqrcode/unlimited', 'post', data, true)
  },
  noticeGet: (data) => {//查询商城通知
    return request('/yomi/api/yo/notice', 'get', data, true)
  },
  orderItemGet: (id) => {//查询订单详情
    return request('/yomi/api/yo/orderitem/' + id, 'get', null, false)
  },
  orderRefundsSave: (data) => {//发起退款
    return request('/yomi/api/yo/orderrefunds', 'post', data, true)
  },
  userInfoGet: () => {//查询商城用户信息
    return request('/yomi/api/yo/userinfo', 'get', null, false)
  },
  userIntegration: () => {//查询商城用户信息
    return request('/yomi/api/yo/userinfo/integration', 'get', null, false)
  },
  pointsRecordPage: (data) => {//查询积分记录
    return request('/yomi/api/yo/pointsrecord/page', 'get', data, false)
  },
  pointsConfigGet: () => {//查询积分配置
    return request('/yomi/api/yo/pointsconfig', 'get', null, false)
  },
  couponUserSave: (data) => {//电子券用户领取
    return request('/yomi/api/yo/couponuser', 'post', data, true)
  },
  couponUserPage: (data) => {//电子券用户列表
    return request('/yomi/api/yo/couponuser/page', 'get', data, false)
  },
  couponInfoPage: (data) => {//电子券列表
    return request('/yomi/api/yo/couponinfo/page', 'get', data, false)
  },
  bargainInfoPage: (data) => {//砍价列表
    return request('/yomi/api/yo/bargaininfo/page', 'get', data, false)
  },
  bargainInfoGet: (data) => {//砍价详情
    return request('/yomi/api/yo/bargaininfo', 'get', data, true)
  },
  bargainUserSave: (data) => {//发起砍价
    return request('/yomi/api/yo/bargainuser', 'post', data, true)
  },
  bargainCutPage: (data) => {//帮砍记录
    return request('/yomi/api/yo/bargaincut/page', 'get', data, true)
  },
  bargainUserGet: (id) => {//砍价记录详情
    return request('/yomi/api/yo/bargainuser/' + id, 'get', null, false)
  },
  bargainUserPage: (data) => {//砍价记录列表
    return request('/yomi/api/yo/bargainuser/page', 'get', data, true)
  },
  bargainCutSave: (data) => {//砍一刀
    return request('/yomi/api/yo/bargaincut', 'post', data, true)
  },
  listEnsureBySpuId: (data) => {//通过spuID，查询商品保障
    return request('/yomi/api/yo/ensuregoods/listEnsureBySpuId', 'get', data, true)
  },
  grouponInfoPage: (data) => {//拼团列表
    return request('/yomi/api/yo/grouponinfo/page', 'get', data, false)
  },
  grouponInfoGet: (id) => {//拼团详情
    return request('/yomi/api/yo/grouponinfo/' + id, 'get', null, true)
  },
  grouponUserPageGrouponing: (data) => {//拼团中分页列表
    return request('/yomi/api/yo/grouponuser/page/grouponing', 'get', data, true)
  },
  grouponUserPage: (data) => {//拼团记录列表
    return request('/yomi/api/yo/grouponuser/page', 'get', data, true)
  },
  grouponUserGet: (id) => {//拼团记录详情
    return request('/yomi/api/yo/grouponuser/' + id, 'get', null, false)
  },
  wxTemplateMsgList: (data) => {//订阅消息列表
    return request('/weixin/api/ma/wxtemplatemsg/list', 'post', data, false)
  },
  liveRoomInfoList: (data) => {//获取直播房间列表
    return request('/weixin/api/ma/wxmalive/roominfo/list', 'get', data, true)
  },
  seckillhallList: (data) => {
		//秒杀会场时间列表
		return request('/yomi/api/yo/seckillhall/list?hallDate='+data, 'get', null, false);
	},
	seckillinfoPage: (data) => {
		//秒杀列表
		return request('/yomi/api/yo/seckillinfo/page', 'get', data, false);
	},
	seckillInfoGet: (seckillHallInfoId) => {
		//秒杀详情
		return request('/yomi/api/yo/seckillinfo/' + seckillHallInfoId, 'get', null, true);
  },
  addDeliveryPoint: (data) => {
		return request('/yomi/api/yo/deliverypoint', 'post', data, false);
  },
  updateDeliveryPoint: (data) => {
		return request('/yomi/api/yo/deliverypoint', 'put', data, false);
  },
  deliveryPointGetOne: (id) => {
		return request('/yomi/api/yo/deliverypoint/' + id, 'get', null, false);
  },
  deliveryPointUpdateById: (data) => {
		return request('/yomi/api/yo/deliverypoint', 'put', data, true);
  },
  deliveryPointAdaptive: (data) => { 
		return request('/yomi/api/yo/deliverypoint/adaptive', 'post', data, false);
  },
  listRegistrationByPersonal: (data) => {//个人任务列表
    return request('/yomi/api/yo/registration/list', 'get', data, true)
  },
  listAssignmentPage: (data) => { //任务列表
    return request('/yomi/api/yo/assignment/page', 'get', data, true)
  },
  listClassification: (data)=>{ //文明宣讲列表
    return request('/yomi/api/yo/preach/classification','get',data,true)
  },
  classificationByList: (id)=>{ //单个文明宣传
    return request('/yomi/api/yo/preach/list/'+id,'get',null,true)
  },
  saveEvaluation: (data)=>{  //宣讲评论
    return request('/yomi/api/yo/preach/evaluation','post',data,true)
  },
  saveInvited: (data)=>{  //宣讲邀请
    return request('/yomi/api/yo/preach/invited','post',data,true)
  },

   uploadImage:__config.basePath+'/yomi/api/yo/file/upload',//图片上传接口
  createTeam:(data)=>{   // 创建队伍
    return request('/yomi/api/yo/assignment/organization','post',data,true);
  },
  publishTask:(data)=>{  //发布任务
    return request('/yomi/api/yo/assignment','post',data,true);
  },
  rankingGet:(data)=>{ //积分排名
    return request('/yomi/api/yo/userinfo/page','get',data,true);
  },
  newstrendsGet:(data)=>{ //积分排名
    return request('/yomi/api/yo/newstrends/page','get',data,true);
  },
  getMyteam:()=>{  //我的队伍
    return request('/yomi/api/yo/assignment/organization/one','get',null,true);
  },
  getMyHelp:(data)=>{ //寻求帮助 我的记录
    return request('/yomi/api/yo/assignment/asking/page','get',data,true);
  },
  createHelp:(data)=>{
    return request('/yomi/api/yo/assignment/asking','post',data,true);
  },
  getSourcingList:()=> {
    return request('/yomi/api/yo/deliverypoint/sourcing/list','get',null,true);
  },
  saveSourcing:(data)=> {
    return request('/yomi/api/yo/deliverypoint/sourcing','post',data,true);
  },
  getGoodsSpuList: (data)=> {
    return request('/yomi/api/yo/goodsspu/list','get',data,false);
  },
  getGoodsSkuList: (spuId)=> {
    return request('/yomi/api/yo/goodsspu/list/' + spuId,'get',null,true);
  },
  getApplyForList: (data)=> {
    return request('/yomi/api/yo/goodsspu/apply/page', 'get', data, false);
  },
  saveApplyFor: (data)=> {
    return request('/yomi/api/yo/goodsspu/apply', 'post', data, true);
  },
  isDep: ()=> {
    return request('/yomi/api/yo/deliverypoint/isdep','get',null,true);
  },
  substitution: (revised) => {
    return request('/yomi/api/yo/deliverypoint/substitution/' + revised,'get',null,true);
  },

  registration:(id)=>{ //报名
    return request('/yomi/api/yo/registration/reg/'+id,'get',null,true);
  },
  cannelRegistration:(id)=>{ //取消报名
    return request('/yomi/api/yo/registration/cannel/'+id,'get',null,true);
  },
  myTaskListGet:()=>{ //我的任务打卡
    return request('/yomi/api/yo/assignment/punchin/list','get',null,true);
  },
  createPunchin:(data)=>{ //打卡
    return request('/yomi/api/yo/assignment/punchin','post',data,true);
  },
  getUserHonour:(id)=>{   //个人荣誉
    return request('/yomi/api/yo/userinfo/'+id,'get',null,true);
  },
  updateHonourText(data){ //修改个人 text
    return request('/yomi/api/yo/userinfo','put',data,true);
  },
  updateHonour:(data)=>{  //修改个人荣誉
    return request('/yomi/api/yo/userinfo/personalglory','put',data,true);
  },
  createHonour:(data)=>{  //修改个人荣誉
    return request('/yomi/api/yo/userinfo/personalglory','post',data,true);
  },
  deleteHonour:(id)=>{  //删除荣誉图片
    return request('/yomi/api/yo/userinfo/personalglory/'+id,'delete',null,true);
  },
  getUserHonourImgList(id){ //荣誉图片list
    return request('/yomi/api/yo/userinfo/personalglory/list/'+id,'get',null,true);
  },
  getUnitList(){ //单位列表
    return request('/yomi/api/yo/userinfo/unit/list','get',null,true);
  },
  getPhones(data){
    return request('/yomi/api/yo/userinfo/phone','post',data,true);
  },
  getMyTask(pathStr){
    return request('/yomi/api/yo/assignment'+pathStr,'get',null,true);
  },
}