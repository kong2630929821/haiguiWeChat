/**
 * 常用工具
 */
import { popNew } from '../../pi/ui/root';
import { GoodsDetails, MallLabels } from '../store/memstore';

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

// 计算价格相关  （包括折扣 购价 返利）
export const calcPrices = (goods:GoodsDetails) => {
    const vipLevel = getVipLevel();
    const ret = {
        origin:goods.origin,   // 原价
        sale:goods.origin,   // 售价
        discount:0,           // 几折
        rebate:0              // 返利
    };
    if (vipLevel === 1) { // 海宝
        ret.discount = goods.discount ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount ? goods.discount : (goods.vip_origin ? goods.vip_origin : goods.origin);
    } else if (vipLevel === 2) { // 海王
        ret.discount = goods.discount ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount ? goods.discount : (goods.vip_origin ? goods.vip_origin : goods.origin);
        ret.rebate = goods.rebate;
    } else {   // 非vip

    }

    return ret;
};

// 展示选择标签的图片
export const filterShowLabelImage = (labels:MallLabels[],labeled:MallLabels) => {
    for (const label of labels) {
        for (let i = 0;i < label.childs.length;i++) {
            const childLabel = label.childs[i];
            if (childLabel.name === labeled.name) return childLabel.image;
        }
    }
};

// 计算标签影响的价格
export const  calLabelPrice = (hasLabels:MallLabels[]) => {
    let labelPrice = 0;
    for (const v of hasLabels) {
        labelPrice += v.price;
    }

    return labelPrice;
};