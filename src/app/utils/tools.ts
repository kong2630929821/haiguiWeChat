/**
 * 常用工具
 */
import { popNew } from '../../pi/ui/root';
import { GoodsDetails, GoodsInventory, MallLabels } from '../store/memstore';

// 弹出提示框
export const popNewMessage = (content: any) => {
    popNew('app-components-message-message', { content });
};

// 弹出loading
export const popNewLoading = (text: any) => {
    return popNew('app-components-loading-loading', { text });
};

let vipLevel;
// 获取vip等级
export const getVipLevel = () => {
    if (vipLevel !== undefined) return vipLevel;
    const random = Math.random();
    if (random > 0.7) {
        vipLevel = 2;
    } else if (random > 0.4) {
        vipLevel = 1;
    } else {
        vipLevel = 0;
    }
    
    return vipLevel;
};

// 计算打折力度
export const calcDiscount = (discount:number,origin:number) => {
    return Number((discount / origin * 10).toFixed(1));
};

// 价钱格式化  单位分
export const priceFormate = (price:number) => {
    return (price / 100).toFixed(2);
};
// 计算价格相关  （包括折扣 购价 返利）
export const calcPrices = (goods:GoodsDetails) => {
    const vipLevel = getVipLevel();
    const ret = {
        origin:priceFormate(goods.origin),   // 原价
        sale:priceFormate(goods.origin),   // 售价
        discount:0,           // 几折
        rebate:''              // 返利
    };
    if (vipLevel === 1) { // 海宝
        ret.discount = goods.discount ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount ? priceFormate(goods.discount) : priceFormate(goods.vip_origin ? goods.vip_origin : goods.origin);
    } else if (vipLevel === 2) { // 海王
        ret.discount = goods.discount ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount ? priceFormate(goods.discount) : priceFormate(goods.vip_origin ? goods.vip_origin : goods.origin);
        ret.rebate = priceFormate(goods.rebate);
    } else {   // 非vip

    }

    return ret;
};
