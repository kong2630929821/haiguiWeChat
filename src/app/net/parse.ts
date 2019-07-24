import { Address, AfterSale, Area, CartGoods, Freight, GoodsDetails, GoodsSegmentationDetails, Groups, GroupsLocation, MallImages, Order, SKU } from '../store/memstore';
import { unicode2Str } from '../utils/tools';

/**
 * 数据处理
 */

export const parseAllGroups = (location: GroupsLocation, groupsInfo: any) => {
    const groups: Groups[] = [];
    for (const v of groupsInfo) {
        groups.push(parseGroups(location, v));
    }

    return groups;
};

/**
 * 分组数据处理
 */
export const parseGroups = (location: GroupsLocation, info: any) => {
    const itype = info[2] === 'true' ? true : false;
    const childsOrigin = info[6];
    let childs = [];
    let ret: Groups;
    if (itype) {  // 子组  
        for (const v of childsOrigin) {
            childs.push(parseGroups(location, v));
        }
    } else { // 页组
        childs = info[6];
    }

    ret = {
        id: info[0],   // 分组id
        name: unicode2Str(info[1]),   // 分组名
        type: itype,   // 组类型，分为子组和叶组，子组可以包含任意的其它子组或叶组，叶组只允许包含商品
        is_show: info[3] === 'true' ? true : false,
        images: info[4] ? parseMallImage(info[4]) : [],   // 分组包含的图片列表
        detail: info[5],  // 分组详细描述
        location,  // 分组在前端的位置，例如商城首页，分类首页等
        childs       // 二级分组信息
    };

    return ret;
};

/**
 * 商品详情处理
 */
export const parseGoodsDetail = (info: any): GoodsDetails => {
    const skus = parseSKU(info[13]);
    const images = parseMallImage(info[14]);

    return {
        id: info[0],	   // 商品id
        name: unicode2Str(info[1]),   // 商品名称
        brand: info[2],  // 品牌id
        area: info[3],	 // 地区id
        supplier: info[4], // 供应商id
        pay_type: info[5],	// 	支付类型，1现金，2积分，3表示同时支持现金和积分
        rebate: info[6][0],    // 返利（仅限海王）
        origin: info[7],   // 	商品原价，单位分
        vip_origin: info[8],  // 会员商品原价，单位分
        goodsType: info[9],    // 商品类型 0 普通商品 1 保税商品 2 海外直购
        tax: info[10],	// 商品税费，单位分
        discount: info[11],	// 商品折后价，单位分，即原价 + 税费 - 折扣
        labels: skus,	 // SKU SKU描述 价格影响 库存
        images,	 // 商品包含的图片列表
        intro: info[15],		// 商品介绍

        detail: info[16] ? parseGoodsSegmentationDetails(info[16][1]) : [],  // 商品分段详细描述
        spec: [], // 商品规格   info[16][0],
        flag: info[17], // 商品是否下架
        onSaleTime: info[18],  // 上架时间
        saleCount: info[19],  // 销量
        isActGoods: !!info[20]  // 是否是活动商品
    };

};

/**
 * 商品分段详情解析
 */
export const parseGoodsSegmentationDetails = (infos: any) => {
    const tmps: GoodsSegmentationDetails[] = [];
    for (const info of infos) {
        const tmp: GoodsSegmentationDetails = {
            name: unicode2Str(info[0]),  // 分段名
            value: info[1], // 分段详细描述
            image: parseMallImage([info[2]])[0] // 分段图片path
        };
        tmps.push(tmp);
    }

    return tmps;
};

/**
 * 解析图片
 */
export const parseMallImage = (infos: any) => {
    const images: MallImages[] = [];
    for (const v of infos) {
        const image: MallImages = {
            path: v[0],  // 图片url
            type: v[1],  // 图片的类型，例如图标、小图、大图等
            style: v[2] // 图片显示的样式类型，例如静态、滚动、缩放等
        };
        images.push(image);
    }

    return images;
};

/**
 * 解析sku
 */
export const parseSKU = (infos: any) => {
    const skus: SKU[] = [];
    for (const v of infos) {
        const sku: SKU = [v[0], unicode2Str(v[1]), v[2], v[3]];
        skus.push(sku);
    }

    return skus;
};

/**
 * 解析购物车数据
 */
export const parseCart = (infos: any) => {
    const carts = [];
    for (const info of infos) {
        const goodsInfo = [info[1]].concat(info[4]);
        const goodsDetail = parseGoodsDetail(goodsInfo);
        goodsDetail.labels = parseSKU([info[3]]);
        const cart:CartGoods = {
            index:info[0],        // 索引
            goods:goodsDetail,   // 商品详细信息
            amount:info[2],        // 购买数量
            selected:false,     // 是否勾选  默认false  getCartGoodsSelected(info[0])
            skuIndex:0
        };
        carts.push(cart);
    }

    return carts;
};

/**
 * 收货地址解析
 */
export const parseAddress = (infos: any) => {

    const addresses = [];
    for (const info of infos) {
        const id = info[0][1];
        const info1 = info[1];
        const address: Address = {
            id,
            name: unicode2Str(info1[0]),
            tel: info1[1],
            area_id: info1[2],
            address: unicode2Str(info1[3])
        };
        addresses.push(address);
    }

    return addresses;
};

/**
 * 收货地址解析
 */
export const parseAddress2 = (infos: any) => {
    const addresses = [];
    for (const info of infos) {
        const id = info[0];
        const address: Address = {
            id,
            name: unicode2Str(info[1]),
            tel: info[2],
            area_id: info[3],
            address: unicode2Str(info[4])
        };
        addresses.push(address);
    }

    return addresses;
};
/**
 * 解析运费信息
 */
export const parseFreight = (infos: any) => {
    const freights = [];
    for (const info of infos) {
        const freight: Freight = {
            index: info[0],
            province: unicode2Str(info[1]),   // 省份
            price_type: info[2],    // 价格类型
            price: info[3]         // 价格
        };
        freights.push(freight);
    }

    return freights;
};

// 获取sku详情
const getSku = (skus: SKU[], skuId: string) => {
    for (let i = 0; i < skus.length; i++) {
        if (skus[i][0] === skuId) return skus[i];
    }
};
/**
 * 解析订单详情
 */
export const parseOrder = (infos: any) => {
    const orders = [];
    for (const info of infos) {
        if (info[14] <= 0) continue;     // 下单时间为0  订单退回
        const orderGoods = [];
        let fg = true;  // SKU是否是正确的标记
        for (const v of info[2]) {
            const goods = parseGoodsDetail(v[0]);
            const amount = v[1];
            const unit = v[2];
            if (!v[3] || !v[3][0]) { // SKU出错，直接跳过该订单
                fg = false;
                break;
            }
            v[3][0][1] = unicode2Str(v[3][0][1]);
            goods.labels = [v[3][0]];
            orderGoods.push([goods, amount, unit]);
        }
        if (!fg) {  // SKU出错，直接跳过该订单
            continue;
        }
        // info[1] 为uid  无用
        const order: Order = {
            id: info[0],		       // 订单id
            orderGoods,   // (商品详细信息) (购买数量)
            pay_type: info[3],       // 支付类型，1现金，2积分，3表示同时支持现金和积分
            origin: info[5],         // 商品原支付金额，单位分，即所有商品单价乘数量
            tax: info[6],				// 	商品税费，单位分，即所有商品税费乘数量
            freight: info[7],        // 商品运费，单位分
            other: info[8],          // 其它费用，单位分
            name: unicode2Str(info[10]),           // 收件人姓名
            tel: info[11],            // 收件人电话
            area: info[12],           // 收件人地区
            address: unicode2Str(info[13]),        // 收件人详细地址
            order_time: info[14],     // 下单时间，单位毫秒
            pay_time: info[15],       // 支付时间，单位毫秒
            ship_time: info[16],      // 发货时间，单位毫秒
            receipt_time: info[17],   // 收货时间，单位毫秒
            finish_time: info[18],    // 完成时间，单位毫秒，已收货，但未完成，例如退货
            ship_id: info[19]         // 物流单号
        };
        orders.push(order);
    }

    return orders;
};

/**
 * 解析地区信息
 */
export const parseArea = (info: any) => {
    const info1 = info[1];
    // tslint:disable-next-line:no-unnecessary-local-variable
    const area: Area = {
        id: info[0],  // 	地区id
        name: unicode2Str(info1[0]), // 	地区名
        images: parseMallImage(info1[1]), // 	地区包含的图片列表
        detail: info1[2], // 	地区详细描述
        goods: info1[3] ? info1[3] : []	// 地区商品列表
    };

    return area;
};

/**
 * 解析售后订单
 */
export const parseAfterSale = (infos: any, orders: Order[]) => {
    const afterSaleOrders = [];
    for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        const order = filterOrderGoods(orders[i], info[2], info[4][0]);
        const afterSaleOrder: AfterSale = {
            id: info[0],		      // 售后订单id
            order,                // 售后商品订单详情
            tax: info[5],           // 商品总税费，单位分
            weight: info[6],        // 商品总重量，单位克
            status: info[7],		  // 售后状态，-1退货失败，0无售后，1退货
            reason: info[8],	      // 原因，根据status，则为退货失败原因，无，退货原因
            request_time: info[9],  // 请求售后时间
            reply_time: info[10],    // 回应售后时间
            finish_time: info[11],   // 完成售后时间
            shipId:info[12],         // 退货运单号
            refuseReason: info[13]   // 退货被拒绝原因
        };
        afterSaleOrders.push(afterSaleOrder);
    }

    return afterSaleOrders;
};

// 过滤固定商品的订单
const filterOrderGoods = (order: Order, goodsid: number, skuId: string) => {
    const goods = order.orderGoods.filter((v) => {
        return (v[0].id === goodsid && v[0].labels[0][0] === skuId);
    });
    order.orderGoods = goods;

    return order;
};