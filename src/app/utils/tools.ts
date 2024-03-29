/**
 * 常用工具
 */
import { popNew } from '../../pi/ui/root';
import { getFreight } from '../net/pull';
import { Freight, getStore, GoodsDetails, ImageType, MallImages, SKU } from '../store/memstore';

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

// 价格格式化1  超出10000单位改为万
export const priceFormat1 = (price:number) => {
    const newPrice = price / 100;
    // if (newPrice > 10000) {
    //     newPrice = newPrice / 10000;
        
    //     return `${newPrice.toFixed(2)}万`;
    // }

    return newPrice.toFixed(2);
};

// 积分 海贝格式化  超出10000单位改为万
export const priceFormat2 = (price:number) => {
    if (price > 10000) {
        price = price / 10000;
        
        return `${price.toFixed(2)}万`;
    }
    
    return price;
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
        rebate:0,             // 返利
        vipSale:goods.vip_origin // 会员价（给白客看）
    };
    if (vipLevel === UserType.hBao) { // 海宝
        ret.sale = goods.discount !== goods.origin ? (goods.discount > goods.vip_origin ? goods.vip_origin :goods.discount) : (goods.vip_origin ? goods.vip_origin : goods.origin);
        ret.discount = goods.discount !== goods.origin ? calcDiscount(ret.sale,goods.origin) : calcDiscount(ret.sale,goods.origin);
    } else if (vipLevel === UserType.hWang) { // 海王
        ret.sale = goods.discount !== goods.origin ? (goods.discount > goods.vip_origin ? goods.vip_origin :goods.discount) : (goods.vip_origin ? goods.vip_origin : goods.origin);
        ret.discount = goods.discount !== goods.origin ? calcDiscount(ret.sale,goods.origin) : calcDiscount(ret.sale,goods.origin);
        ret.rebate = goods.rebate;
    } else {   // 非vip

    }
    
    return ret;
};

// 计算运费
export const calcFreight = async (area_id:number,supId:number,gType:number) => {
    // const freights = getStore('mall/freights');
    const freights = await getFreight(supId,gType);
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
export const calcInventorys = (skus:SKU[],skuIndex:number) => {
    if (skuIndex >= 0) {
        return skus[skuIndex][3];
    }
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

/**
 * unicode转string
 */
export const unicode2Str = (infos:any) => {
    if (typeof infos !== 'object') return infos;
    let str = '';
    for (const v of infos) {
        str += String.fromCharCode(v);
    }

    return str;
};

/**
 * strign转unicod
 */
export const str2Unicode = (str:string) => {
    const arr = [];
    for (const v of str) {
        arr.push(v.charCodeAt(0));
    }

    return arr;
};
// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

/**
 * 电话号码格式检查
 */
export const checkPhone = (phoneNumber:string) => { 
    if (/^1[3456789]\d{9}$/.test(phoneNumber)) { 
        return true; 
    } 

    return false;
};

/**
 * 运费说明描述
 */
export const calcFreightDesc = (freights:Freight[]) => {
    const obj = {};
    const freightsArr = [];
    for (const v of freights) {
        let arr = obj[v.price];
        if (!arr) {
            arr = [];
        }
        arr.push(v.province);
        obj[v.price] = arr;
        if (freightsArr.indexOf(v.price) < 0) freightsArr.push(v.price);
    }
    
    freightsArr.sort((a1,a2) => a1 - a2);
    const minFreight = freightsArr[0];
    const maxFreight = freightsArr[freightsArr.length - 1];
    const freightInterval = `${priceFormat(minFreight)}-${priceFormat(maxFreight)}`;
    let freightDesc = `普通运费${priceFormat(minFreight)}元`;
    for (let i = 1;i < freightsArr.length;i++) {
        const k = freightsArr[i];
        const str = obj[k].join('、');
        freightDesc += `,${str}运费${priceFormat(k)}元`; 
    }
    console.log('obj ====',obj);
    console.log('freightDesc ====',freightDesc);
    
    console.log('freightInterval ===',freightInterval);

    return {
        freightInterval,
        freightDesc
    };
};

/**
 * 将Unicode字符串转成可读字符串
 */
export const unicode2ReadStr = (item:any) => {
    if (item && typeof(item) === 'string') {
        return unicode2Str(JSON.parse(item));
    }

    return unicode2Str(item);
};

/**
 * 函数防抖
 * @param func 函数
 */
export const throttle = (func) => {
    const intervel = 300;
    let lastTime = 0;
    
    return  () => {
        const nowTime = + new Date();
        const args = arguments;
        if (nowTime - lastTime > intervel) {
            func.apply(undefined, args);
            lastTime = nowTime;
        }
    };
};

/**
 * 地址格式化
 */
export const addressFormat = (addrStr:string) => {
    try {
        const address = JSON.parse(addrStr);

        return `${address[0].join('')}${address[1]}`;

    } catch (err) {
        return addrStr;
        
    }
};

/**
 * 过滤表情符号
 */
export const filterEomoji = (str:string) => {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g;
    str = str.replace(patt, (char) => {
        if (char.length === 2) {   // 辅助平面字符（我们需要做处理的一类）

            return '';
        } else {
            return char;
        }
    });

    return str;
};

/**
 * arrayBuffer转file格式
 */
export const arrayBuffer2File = (buffer:ArrayBuffer) => {
    const u8Arr = new Uint8Array(buffer);
    const blob = new Blob([u8Arr], { type: 'image/jpeg' });
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log('arrayBuffer2File = ',newFile);

    return newFile;
};

enum UserType {
    hWang= 1,  // 海王
    hBao= 2,   // 海宝
    baiKe= 3,  // 白客
    city= 11,   // 市代理
    province= 12,  // 省代理
    hWangTest= 13,  // 海王体验
    hBaoTest= 23   // 海宝体验
}
const UserTypeShow = {
    hWang:'海王会员',
    hBao:'海宝会员',
    baiKe:'',
    city:'市代理',
    province:'省代理',
    hWangTest:'海王（体验）',
    hBaoTest:'海宝（体验）'
};
// 获取用户身份
export const getUserType = (level:number,label:number) => {
    return UserTypeShow[UserType[Number(`${level === 4 ? 3 :level}${label > 0 ? label :''}`)]];
};

// 处理站内消息
export const deelMessage = (r:any) => {
    if (!r) {
        return [];
    }
    const data = [];
    r.forEach(v => {
        const arr = [];
        v[1][2].forEach(t => {
            arr.push(
                { key:`${unicode2Str(t[0])}`,value:unicode2Str(t[1]) }
            );
        });
        data.push({
            id:v[0][1],// 消息ID
            start:unicode2Str(v[1][0]),// 标题
            time:timestampFormat(v[1][4]),
            title:unicode2Str(v[1][1]),// 标题开头
            content:arr,
            coda:unicode2Str(v[1][3])// 标题结尾
        });
    });

    return data;
};