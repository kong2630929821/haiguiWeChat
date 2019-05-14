/**
 * 常用工具
 */
import { popNew } from '../../pi/ui/root';
import { getStore, GoodsDetails, ImageType, MallImages, SKU, UserType } from '../store/memstore';

// 弹出提示框
export const popNewMessage = (content: any) => {
    popNew('app-components-message-message', { content });
};

// 弹出loading
export const popNewLoading = (text: any) => {
    return popNew('app-components-loading-loading', { text });
};

// 获取vip等级
export const getVipLevel = () => {
    return getStore('user/userType');
};

// 价格格式化
export const priceFormat = (price:number) => {
    return (price / 100).toFixed(2);
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
    if (vipLevel === UserType.hBao) { // 海宝
        ret.discount = goods.discount !== goods.origin ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount !== goods.origin ? goods.discount : (goods.vip_origin ? goods.vip_origin : goods.origin);
    } else if (vipLevel === UserType.hWang) { // 海王
        ret.discount = goods.discount !== goods.origin ? calcDiscount(goods.discount,goods.origin) : calcDiscount(goods.vip_origin,goods.origin);
        ret.sale = goods.discount !== goods.origin ? goods.discount : (goods.vip_origin ? goods.vip_origin : goods.origin);
        ret.rebate = goods.rebate;
    } else {   // 非vip

    }
    
    return ret;
};

// 计算运费
export const calcFreight = (area_id:number) => {
    const freights = getStore('mall/freights');
    for (let i = 0;i < freights.length;i ++) {
        if (freights[i].index === area_id) return freights[i].price;
    }

    return 0;
};

// 获取特定类型的图片url
export const getImagePath = (images:MallImages[],iType:ImageType) => {
    const paths:string[] = [];
    for (const v of images) {
        if (v.type === iType) paths.push(v.path);
    }

    return paths;
};

/**
 * 获取缩略图路径
 */
export const getImageThumbnailPath = (images:MallImages[]) => {
    return getImagePath(images,ImageType.THUMBNAIL)[0];
};

/**
 * 获取主图图路径
 */
export const getImageMainPath = (images:MallImages[]) => {
    return getImagePath(images,ImageType.MAIN);
};

/**
 * 获取详情图路径
 */
export const getImageDetailPath = (images:MallImages[]) => {
    return getImagePath(images,ImageType.DETAIL);
};

/**
 * 计算商品库存
 */
export const calcInventorys = (skus:SKU[]) => {
    let num = 0;
    for (const v of skus) {
        num += v[3];
    }

    return num;
};

// 获取购物车商品是否被选中
export const getCartGoodsSelected = (index:number):boolean => {
    const carts = getStore('mall/cartGoods');
    for (let i = 0;i < carts.length;i++) {
        if (carts[i].index === index) return carts[i].selected;
    }
    
    return false;
};