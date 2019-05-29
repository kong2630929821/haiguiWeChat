/**
 * 权益相关
 */

// 海宝权益描述
export const hBaoDesc = [
    '您可以获得平台赠送的护肤产品，指定服务及海龟壹号海宝会员权益；',
    '您可以获得平台赠送的24份护肤面膜套装，该套装每周领取一次，每次领取，您需要额外支付邮费；',
    '您可以使用海龟壹号提供的统一客服管理平台，商品销售管理工具、营销工具、分享素材工具等管理系统；',
    '您享有海龟壹号自营及第三方商家商品/服务进行信息推广的资格，并根据推广效果享受相应的佣金收益',
    '您将享有海龟壹号核心产品的试用，最低折扣与分享资格；',
    '您有权申请参加线下新零售相关课程，同时成为海协会俱乐部VIP会员'
];

// 海王权益描述
export const hWangDesc = [
    '您将获得平台赠送的指定高级护肤产品，指定服务及海龟壹号海王会员权益；',
    '您可以获得平台赠送的48份护肤面膜套装，该套装每周领取一次，每次领取，您需要额外支付邮费；',
    '您可以使用海龟壹号提供的统一客服管理平台，商品销售管理工具、营销工具、分享素材工具等管理系统；',
    '您享有海龟壹号自营及第三方商家商品/服务进行信息推广的资格，并根据推广效果享受相应的佣金收益',
    '您将享有海龟壹号核心产品的试用，最低折扣与分享资格；',
    '您有权参加线下《心灵开悟之道》、《无敌营销宝典》课程；'
];

// 权益标记
export enum PowerFlag {
    gift = 1,   // 美白礼包
    vipGift,   // 尊享礼包 有粉色背景
    free,   // 免费试用装
    offClass,  // 线下课程  有分享按钮
    integral,   // 10倍积分
    inviteCode,   // 邀请码
    rebate,    // 返利
    saleClass,   // 销售课程
    vipClass   // 精品课程
}
// 海宝权益
export const hBaoPower = [
    { name: '美白礼包', img: 'power_mask.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.gift },
    { name: '尊享礼包', img: 'power_gift.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.vipGift },
    { name: '免费试用装', img: 'power_test.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.free },
    { name: '线下课程', img: 'power_book.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.offClass },
    { name: '邀请好友', img: 'power_invite.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.inviteCode },
    { name: '海宝返利', img: 'power_return.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.rebate },
    { name: '百倍积分', img: 'power_integral.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.integral }
];

// 海王权益
export const hWangPower = [
    { name: '美白礼包', img: 'power_mask.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.gift },
    { name: '尊享礼包', img: 'power_gift.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.vipGift },
    { name: '免费试用装', img: 'power_test.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.free },
    { name: '线下课程', img: 'power_book.png',tpl: 'app-view-member-giftPage', fg: PowerFlag.offClass },
    { name: '精品课程', img: 'power_diamond.png',tpl: 'app-view-member-giftPage', fg: PowerFlag.vipClass },
    { name: '销售课程', img: 'power_tv.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.saleClass },
    { name: '邀请好友', img: 'power_invite.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.inviteCode },
    { name: '多方返利', img: 'power_return.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.rebate },
    { name: '百倍积分', img: 'power_integral.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.integral }
];
