/**
 * 权益相关
 */

// 海宝权益描述
export const hBaoDesc = [
    '购买班森·High School Gilrs焕颜亮肤礼包，即可获得本商城赠送的海宝会员资格，尊享海宝会员权益;',
    '您可获得平台赠送的面膜套装，该套装每7日领取一次，24次领取完毕，每次领取需支付邮费；',
    '您可以使用海龟壹号提供的统一客户管理平台、商品销售管理工具、营销工具、分享素材工具等；',
    '您享有海龟壹号自营及第三方商家商品/服务推广的资格，并根据推广效果享受相应的收益；',
    '您将享有海龟壹号核心产品的试用与分享资格，以及相应权益折扣价；',
    '您有权申请参加线下《玩转新零售》课程；获得海协会俱乐部VIP会员资格。'
    
];

// 海王权益描述
export const hWangDesc = [
    '购买班森·High School Gilrs万元大礼包，即可获得本商城赠送的海王会员资格，尊享海王会员权益；',
    '您可获得平台赠送的面膜套装，该套装每7日领取一次，48次赠送完毕，每次领取需支付邮费；',
    '您可以使用海龟壹号提供的统一客户管理平台、商品销售管理工具、营销工具、分享素材工具等；',
    '您享有海龟壹号自营及第三方商家商品/服务推广的资格；',
    '您享有海龟壹号自营及第三方商家商品/服务推广受益后相应的收益；',
    '您将享有海龟壹号核心产品的试用与分享资格；',
    ' 您将享有海龟壹号主推品牌相应权益折扣价；',
    '您有权申请参加线下《心灵开悟之道》《无敌营销宝典》课程。'
];

// 权益标记
export enum PowerFlag {
    gift = 1,   // 美白礼包
    vipGift,   // 尊享礼包 有粉色背景
    free,   // 免费试用装
    offClass,  // 线下课程  有分享按钮
    integral,   // 10倍积分
    inviteCode,   // 邀请好友
    rebate,    // 返利
    saleClass,   // 销售课程
    vipClass   // 精品课程
}
// 海宝权益
export const hBaoPower = [
    // { name: '领取礼包', img: 'power_mask.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.gift },
    { name: '面膜套装', img: 'power_gift1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.vipGift },
    { name: '免费试用装', img: 'power_test1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.free },
    { name: '新零售课程推广资格', img: 'power_book1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.offClass },
    { name: '邀请好友', img: 'power_invite1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.inviteCode },
    { name: '折扣与积分', img: 'power_return1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.rebate },
    { name: '精品课程', img: 'power_diamond1.png',tpl: 'app-view-member-giftPage', fg: PowerFlag.vipClass }
    // { name: '百倍积分', img: 'power_integral.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.integral }
];

// 海王权益
export const hWangPower = [
    { name: '护肤礼包', img: 'power_mask1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.gift },
    { name: '面膜套装', img: 'power_gift1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.vipGift },
    { name: '免费试用装', img: 'power_test1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.free },
    { name: '新零售课程推广资格', img: 'power_book1.png',tpl: 'app-view-member-giftPage', fg: PowerFlag.offClass },
    { name: '精品课程', img: 'power_diamond1.png',tpl: 'app-view-member-giftPage', fg: PowerFlag.vipClass },
    { name: '销售课程', img: 'power_tv1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.saleClass },
    { name: '邀请好友', img: 'power_invite1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.inviteCode },
    { name: '尊享折扣', img: 'power_return1.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.rebate }
    // { name: '百倍积分', img: 'power_integral.png', tpl: 'app-view-member-giftPage', fg: PowerFlag.integral }
];
