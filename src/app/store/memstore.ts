import { HandlerMap } from '../../pi/util/event';

/**
 * 判断是否是对象
 */
const isObject = (value: any) => {
    const vtype = typeof value;

    return value !== null && (vtype === 'object' || vtype === 'function');
};

/**
 * 数据深拷贝
 */
export const deepCopy = (v: any): any => {
    if (!v || v instanceof Promise || !isObject(v)) return v;
    if (v instanceof Map) {
        return v;  // TODO 暂不对map做处理

        // return new Map(JSON.parse(JSON.stringify(v)));
    }

    const newobj = v.constructor === Array ? [] : {};
    for (const i in v) {
        newobj[i] = isObject(v[i]) ? deepCopy(v[i]) : v[i];
    }

    return newobj;
};

/**
 * 根据路径获取数据
 */
export const getStore = (path: string, defaultValue = undefined) => {
    let ret = store;
    for (const key of path.split('/')) {
        if (key in ret) {
            ret = ret[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('getStore Failed, path = ' + path);
        }
    }
    const deepRet = deepCopy(ret);

    return (typeof deepRet === 'boolean' || typeof deepRet === 'number') ? deepRet : (deepRet || defaultValue);
};

/**
 * 更新store并通知
 */
export const setStore = (path: string, data: any, notified = true) => {
    const keyArr = path.split('/');

    const notifyPath = [];
    for (let i = 0; i < keyArr.length; i++) {
        // tslint:disable-next-line:prefer-template
        const path = i === 0 ? keyArr[i] : notifyPath[i - 1] + '/' + keyArr[i];
        notifyPath.push(path);
    }
    // console.log(notifyPath);
    // 原有的最后一个键
    const lastKey = keyArr.pop();

    let parent = store;
    for (const key of keyArr) {
        if (key in parent) {
            parent = parent[key];
        } else {
            // 路径中有和store内部不同的键，肯定是bug
            // tslint:disable-next-line:prefer-template
            throw new Error('setStore Failed, path = ' + path);
        }
    }
    parent[lastKey] = deepCopy(data);

    if (notified) {
        for (let i = notifyPath.length - 1; i >= 0; i--) {
            handlerMap.notify(notifyPath[i], getStore(notifyPath[i]));
        }
    }
};

/**
 * 注册消息处理器
 */
export const register = (keyName: string, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

/**
 * 取消注册消息处理器
 */
export const unregister = (keyName: string, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// 一级分组详细信息
export interface Level1Groups {    
    id:number;    // 分组id
    name:string;   // 分组名
    // tslint:disable-next-line:no-reserved-keywords
    type:boolean;     // 组类型，分为子组和叶组，子组可以包含任意的其它子组或叶组，叶组只允许包含商品
    images:MallImages[];   // 分组包含的图片列表
    detail:string;  // 分组详细描述
    location:number;  // 分组在前端的位置，例如商城首页，分类首页等
    childs:Map<number, Level2Groups>;       // 二级分组信息
}

// 二级分组详细信息
export interface Level2Groups {
    id:number;    // 分组id
    name:string;   // 分组名
    // tslint:disable-next-line:no-reserved-keywords
    type:boolean;     // 组类型，分为子组和叶组，子组可以包含任意的其它子组或叶组，叶组只允许包含商品
    images:MallImages[];   // 分组包含的图片列表
    detail:string;  // 分组详细描述

    goods:GoodsDetails[];  // 商品简略信息或者详情信息
}

/************************点进详情页后获取*******************************************/
// 商品详情信息
export interface GoodsDetails {
    id:number;	   // 商品id
    name:string;   // 商品名称
    pay_type:number;	// 	支付类型，1现金，2积分，3表示同时支持现金和积分
    origin:number;   // 	商品原价，单位分
    vip_origin:number;  // 会员商品原价，单位分
    discount:number;	// 商品折后价，单位分，即原价 + 税费 - 折扣
    rebate:number;    // 返利（仅限海王）
    tax:number;		// 商品税费，单位分
    images:MallImages[];	 // 商品包含的图片列表
    intro:string;		// 商品介绍

/******************************************************************/
    labels:MallLabels[];	 // 商品包含的标签id列表，商品有自已的标签，同时会继承分组的标签，相同id的标签则忽略
    brand:number;  // 品牌id
    area:number;	 // 地区id
    supplier:number; // 供应商id
    weight:number;	// 商品重量，单位克
    spec:GoodsSpec[];   // 商品规格
    detail:GoodsSegmentationDetails[];  // 商品分段详细描述
    out:number;       // 当前已出库，但未确认的商品数量
    total_out:number;  // 已出库，且已确认的商品数量
    // tslint:disable-next-line:no-reserved-keywords
    in:number;     // 当前库存数量，负整数表示无限，0表示无货, 正整数表示指定数量的库存
}

// 商品标签
export interface MallLabels {
    id:number;  // 	标签id
    name:string; // 	标签名
    pay_type:number; // 		标签支付类型，1现金，2积分，3表示同时支持现金和积分
    price:number;	// 	标签价格，单位分，负整数表示在商品原价上减去指定的价格，0表示对商品价格不变，正整数表示在商品原价上加上指定的价格
    childs:MallLabels[];	 // 包含的子标签列表，将所有子标签的price求合，再对商品原价进行更新
    image:number;		// 标签图片path
}

// 商品规格
export interface GoodsSpec {
    name:string;  // 商品的规格名
    value:string; // 规格值
}

// 商品分段详细描述
export interface GoodsSegmentationDetails {
    name:string;  // 分段名
    value:string; // 分段详细描述
    image:number; // 分段图片path
}

// 放入购物车的商品
export interface CartGoods {
    goods:GoodsDetails;   // 商品详细信息
    amount:number;     // 购买数量
    labels:MallLabels[];  // 订单商品标签列表
    selected:boolean;     // 是否勾选  默认false
}

// 已下单的商品或者已购买的商品
export interface OrderGoods {
    goods:GoodsDetails;   // 商品详细信息
    amount:number;     // 购买数量
    labels:MallLabels[];  // 订单商品标签列表
}

// 订单详情
export interface Order {
    id:number;		       // 订单id
    orderGoods:OrderGoods[];   // 已购买的商品
    pay_type:number;       // 支付类型，1现金，2积分，3表示同时支持现金和积分
    cost:number;			// 商品成本价，单位分，即所有商品成本价乘数量
    origin:number;         // 商品原支付金额，单位分，即所有商品单价乘数量
    tax:number;				// 	商品税费，单位分，即所有商品税费乘数量
    freight:number;        // 商品运费，单位分
    other:number;          // 其它费用，单位分
    weight:number;         // 商品总重量，单位克，即所有商品重量乘数量
    name:string;           // 收件人姓名
    tel:string;            // 收件人电话
    area:string;           // 收件人地区
    address:string;        // 收件人详细地址
    order_time:number;     // 下单时间，单位毫秒
    pay_time:number;       // 支付时间，单位毫秒
    ship_time:number;      // 发货时间，单位毫秒
    receipt_time:number;   // 收货时间，单位毫秒
    finish_time:number;    // 完成时间，单位毫秒，已收货，但未完成，例如退货
}

// 售后商品订单详情
export interface AfterSaleOrder {
    id:number;		       // 订单id
    pay_type:number;       // 支付类型，1现金，2积分，3表示同时支持现金和积分
    origin:number;         // 商品原支付金额，单位分，即所有商品单价乘数量
    name:string;           // 收件人姓名
    tel:string;            // 收件人电话
    area:string;           // 收件人地区
    address:string;        // 收件人详细地址
    order_time:number;     // 下单时间，单位毫秒
    pay_time:number;       // 支付时间，单位毫秒
    ship_time:number;      // 发货时间，单位毫秒
    receipt_time:number;   // 收货时间，单位毫秒
    finish_time:number;    // 完成时间，单位毫秒，已收货，但未完成，例如退货
}

// 售后详情
export interface AfterSale {
    id:number;		      // 售后订单id
    order:AfterSaleOrder; // 售后商品订单详情
    goods:GoodsDetails;   // 商品详情
    labels:MallLabels;    // 用户为指定商品选择标签
    amount:number;        // 商品数量
    tax:number;           // 商品总税费，单位分
    weight:number;        // 商品总重量，单位克
    status:number;		  // 售后状态，-1退货失败，0无售后，1退货
    reason:string;	      // 原因，根据status，则为退货失败原因，无，退货原因
    request_time:number;  // 请求售后时间
    reply_time:number;    // 回应售后时间
    finish_time:number;   // 完成售后时间
}

// 收件人地址
export interface Address {
    id:number;			// 序号
    name:string;        // 收件人姓名
    tel:string;         // 收件人电话
    area:string;        // 收件人地区
    address:string;  	// 收件人详细地址	    
}

/**
 * 商城图片
 */
export interface MallImages {
    path:string;  // 图片url
    // tslint:disable-next-line:no-reserved-keywords
    type:number;  // 图片的类型，例如图标、小图、大图等
    style:number; // 图片显示的样式类型，例如静态、滚动、缩放等
}

/***********************根据品牌查找时获取***************************/
// 品牌
export interface Brand {
    id:number;    // 	品牌id
    name:string;  // 	品牌名
    images:MallImages[];	// 品牌包含的图片列表
    detail:string;		// 品牌详细描述
    goods:GoodsDetails[];	// 品牌商品列表
}

/***********************根据地区查找时获取***************************/
// 地区
export interface Area {
    id:number;  // 	地区id
    name:string; // 	地区名
    images:MallImages[]; // 	地区包含的图片列表
    detail:string; // 	地区详细描述
    goods:GoodsDetails[];	// 地区商品列表
}

/***********************根据供应商查找时获取***************************/
// 供应商
export interface Supplier {
    id:number;	// 供应商id
    name:string; // 		供应商名
    images:MallImages[]; // 	供应商包含的图片列表
    detail:string; // 		供应商详细描述
    goods:GoodsDetails[];	// 供应商商品id列表
}

// 商城数据
interface Mall {
    groups:Map<number, Level1Groups>;   // 分组数据
    cartGoods:CartGoods[];           // 购物车
    orders:Order[];                  // 订单列表
    afterSales:AfterSale[];          // 售后列表
    addresses:Address[];             // 收件人地址列表
    brands:Brand[];                  // 品牌列表
    areas:Area[];                    // 地区列表
    suppliers:Supplier[];            // 供应商列表
}
/********************************用户权益*********************************** */
// 收益统计
interface EarningTotal {
    baby:number;  // 海宝数量
    cash:number;  // 现金总收益
    partner:number;  // 伙伴数量
    shell:number; // 海贝总收益
}

// 用户类型
export enum UserType {
    hWang = 1,  // 海王
    hBao,   // 海宝
    normal,  // 普通会员  领取过试用装
    other  // 其他
}

// 用户信息
interface User {
    userType:UserType;  // 用户会员等级 
    inviteCode:string;  // 邀请码
}

/******************************store初始化**********************************/
// 海龟一号store
interface Store {
    mall:Mall;                        // 商城数据
    earning:EarningTotal;             // 收益统计
    user:User;                        // 用户信息
}
// 全局内存数据库
const store:Store = {
    mall:{
        groups:new Map<number, Level1Groups>(),   // 分组数据
        cartGoods:[],                           // 购物车 
        orders:[],                              // 订单列表
        afterSales:[],                          // 售后列表
        addresses:[],                           // 收件人地址列表
        brands:[],                              // 品牌列表
        areas:[],                               // 地区列表
        suppliers:[]                            // 供应商列表
    },
    earning:{
        baby:0,
        cash:0,
        partner:0,
        shell:0
    },
    user:{
        userType: UserType.other,
        inviteCode:''
    }
};