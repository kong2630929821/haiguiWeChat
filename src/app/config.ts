/**
 * 配置文件
 */

export const sourceIp = window.location.host;

// 资源服务器port 有些手机浏览器显示端口号无法识别  全部使用默认端口
export const sourcePort = window.location.port || '80';

// erlang逻辑服务器ip
// app.herominer.net
export const erlangLogicIp = sourceIp; 

// erlang逻辑服务器port
export const erlangLogicPort = '2089';

// http请求端口号
export const httpPort = '8091';

// websock连接url
export const wsUrl = `ws://${erlangLogicIp}:${erlangLogicPort}`;

// 商城图片路径
// export const mallImagPre = `http://${window.localStorage.severIp ? window.localStorage.severIp :sourceIp}/dst/imgs/`;
export const mallImagPre = `http://cshop.baomtx.com/dst/imgs/`;

// 未支付订单15分钟后回到购物车中，库存也会回退
export const PendingPaymentDuration = 15 * 60 * 1000;

// 获取图片路径
export const serverFilePath = `http://${sourceIp}:${sourcePort}/service/get_file?sid=`;

// 免费面膜商品ID 
export const freeMaskGoodsId = 10020001;

// 线下课程商品ID
export const OffClassGoodsId = 10020002;

// 399美白礼包A
export const whiteGoodsId_399A = 10020003;

// 399美白礼包B
export const whiteGoodsId_399B = 10020004;

// 1万美白礼包A
export const whiteGoodsId_10000A = 10020005;

// 1万美白礼包B
export const whiteGoodsId_10000B = 10020006;

// 海宝尊享面膜礼包
export const baoVipMaskGoodsId = 10020007;

// 海宝5980线下精品课程
export const baoVipClassGoodsId = 10020008;

// 海宝29800线下销售课程
export const baoSaleClassGoodsId = 10020009;

// 分页请求条数
export const maxCount = 20;

// 猜你喜欢最大条数
export const likedGoodsMaxLen = 60;

// 海王尊享面膜礼包
export const wangVipMaskGoodsId = 10020017;

// 海王5980线下精品课程
export const wangVipClassGoodsId = 10020018;

// 海王29800线下销售课程
export const wangSaleClassGoodsId = 10020019;

// 只能微信支付 (测试可设为false 可用余额支付，余额不足用微信支付)
export const onlyWXPay = false;