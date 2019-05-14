import { Address, CartGoods, Freight, GoodsDetails, GoodsSegmentationDetails, Groups, GroupsLocation, MallImages, Order, SKU } from '../store/memstore';
import { getCartGoodsSelected } from '../utils/tools';

/**
 * 数据处理
 */

export const parseAllGroups = (location:GroupsLocation,groupsInfo:any) => {
    const groups:Groups[] = [];
    for (const v of groupsInfo) {
        groups.push(parseGroups(location,v));
    }

    return groups;
};

/**
 * 分组数据处理
 */
export const parseGroups = (location:GroupsLocation,info:any) => {
    const itype = info[2] === 'true' ? true : false;
    const childsOrigin = info[6];
    const childs = [];  
    let ret:Groups;
    if (itype) {  // 子组  
        for (const v of childsOrigin) {
            childs.push(parseGroups(location,v));
        }
    } else { // 页组
        for (const v of childsOrigin) {
            childs.push(parseGoodsDetail(v));
        }
    }
    ret = {
        id:info[0],   // 分组id
        name:info[1],   // 分组名
        type:itype,   // 组类型，分为子组和叶组，子组可以包含任意的其它子组或叶组，叶组只允许包含商品
        is_show:info[3] === 'true' ? true : false,
        images:info[4] ? parseMallImage(info[4]) : [],   // 分组包含的图片列表
        detail:info[5],  // 分组详细描述
        location,  // 分组在前端的位置，例如商城首页，分类首页等
        childs       // 二级分组信息
    };

    return ret;
};

/**
 * 商品详情处理
 */
export const parseGoodsDetail = (info:any):GoodsDetails => {
    const skus = parseSKU(info[13]);
    const images = parseMallImage(info[14]);
    
    return {
        id:info[0],	   // 商品id
        name:info[1],   // 商品名称
        brand:info[2],  // 品牌id
        area:info[3],	 // 地区id
        supplier:info[4], // 供应商id
        pay_type:info[5],	// 	支付类型，1现金，2积分，3表示同时支持现金和积分
        rebate:info[6],    // 返利（仅限海王）
        origin:info[7],   // 	商品原价，单位分
        vip_origin:info[8],  // 会员商品原价，单位分
        has_tax:info[9] === 'true' ? true : false,    // 是否为保税商品
        tax:info[10],	// 商品税费，单位分
        discount:info[11],	// 商品折后价，单位分，即原价 + 税费 - 折扣
        labels:skus,	 // SKU SKU描述 价格影响 库存
        images,	 // 商品包含的图片列表
        intro:info[15],		// 商品介绍
        
        detail:info[16] ? parseGoodsSegmentationDetails(info[16][1]) : [],  // 商品分段详细描述
        spec:[]   // 商品规格   info[16][0]
    };
    
};

/**
 * 商品分段详情解析
 */
export const parseGoodsSegmentationDetails = (infos:any) => {
    const tmps:GoodsSegmentationDetails[] = [];
    for (const info of infos) {
        const tmp:GoodsSegmentationDetails = {
            name:info[0],  // 分段名
            value:info[1], // 分段详细描述
            image:parseMallImage([info[2]])[0] // 分段图片path
        };
        tmps.push(tmp);
    }
    
    return tmps;
};

/**
 * 解析图片
 */
export const parseMallImage = (infos:any) => {
    const images:MallImages[] = [];
    for (const v of infos) {
        const image:MallImages = {
            path:v[0],  // 图片url
            type:v[1],  // 图片的类型，例如图标、小图、大图等
            style:v[2] // 图片显示的样式类型，例如静态、滚动、缩放等
        };
        images.push(image);
    }

    return images;
};

/**
 * 解析sku
 */
export const parseSKU = (infos:any) => {
    const skus:SKU[] = [];
    for (const v of infos) {
        const sku:SKU = [v[0],v[1],v[2],v[3]];
        skus.push(sku);
    }

    return skus;
};

/**
 * 解析购物车数据
 */
export const parseCart = (infos:any) => {
    const carts = [];
    for (const info of infos) {
        const goodsInfo = [info[1]].concat(info[4]);
        const goodsDetail = parseGoodsDetail(goodsInfo);
        goodsDetail.labels = parseSKU([info[3]]);
        const cart:CartGoods = {
            index:info[0],        // 索引
            goods:goodsDetail,   // 商品详细信息
            amount:info[2],        // 购买数量
            selected:getCartGoodsSelected(info[0])     // 是否勾选  默认false
        };
        carts.push(cart);
    }
    
    return carts;
};

/**
 * 收货地址解析
 */
export const parseAddress = (infos:any) => {
    
    const addresses = [];
    for (const info of infos) {
        const id = info[0][1];
        const info1 = info[1];
        const address:Address = {
            id,
            name:info1[0],
            tel:info1[1],
            area_id:info1[2],
            address:info1[3]
        };
        addresses.push(address);
    }

    return addresses;
};

/**
 * 解析运费信息
 */
export const parseFreight = (infos:any) => {
    const freights = [];
    for (const info of infos) {
        const freight:Freight = {
            index:info[0],
            province:info[1][0],   // 省份
            price_type:info[1][1],    // 价格类型
            price:info[1][2]         // 价格
        };
        freights.push(freight);
    }

    return freights;
};

/**
 * 解析订单详情
 */
export const parseOrder = (infos:any) => {
    const orders = [];
    for (const info of infos) {
        // const order:Order = {
        //     id:0,		       // 订单id
        //     orderGoods:[],   // (商品详细信息) (购买数量)
        //     pay_type:number;       // 支付类型，1现金，2积分，3表示同时支持现金和积分
        //     origin:number;         // 商品原支付金额，单位分，即所有商品单价乘数量
        //     tax:number;				// 	商品税费，单位分，即所有商品税费乘数量
        //     freight:number;        // 商品运费，单位分
        //     other:number;          // 其它费用，单位分
        //     weight:number;         // 商品总重量，单位克，即所有商品重量乘数量
        //     name:string;           // 收件人姓名
        //     tel:string;            // 收件人电话
        //     area:string;           // 收件人地区
        //     address:string;        // 收件人详细地址
        //     order_time:number;     // 下单时间，单位毫秒
        //     pay_time:number;       // 支付时间，单位毫秒
        //     ship_time:number;      // 发货时间，单位毫秒
        //     receipt_time:number;   // 收货时间，单位毫秒
        //     finish_time:number;    // 完成时间，单位毫秒，已收货，但未完成，例如退货
        // };
    }
};