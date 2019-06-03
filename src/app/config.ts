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

// websock连接url
export const wsUrl = `ws://${erlangLogicIp}:${erlangLogicPort}`;

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

// 尊享面膜礼包
export const vipMaskGoodsId = 10020007;

// 5980线下精品课程
export const vipClassGoodsId = 10020008;

// 29800线下销售课程
export const saleClassGoodsId = 10020009;

// 分页请求条数
export const maxCount = 20;

// 猜你喜欢最大条数
export const likedGoodsMaxLen = 60;