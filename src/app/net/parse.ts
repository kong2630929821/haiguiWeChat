import { getStore, GoodsDetails, Groups, GroupsLocation, MallImages, setStore, SKU } from '../store/memstore';

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
        
        detail:info[16] ? info[16] : [],  // 商品分段详细描述
        spec:[]   // 商品规格
    };
    
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
 * 解析余额
 */
export const parseBalance = (res) => {
    const balance = getStore('balance');
    balance.cash = res.money / 100;
    balance.shell = res.haibei;
    balance.integral = res.integral;
    setStore('balance',balance);
};