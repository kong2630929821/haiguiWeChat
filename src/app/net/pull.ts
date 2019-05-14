import { Address, getStore,GroupsLocation, setStore } from '../store/memstore';
import { requestAsync } from './login';
import { parseAllGroups } from './parse';

/**
 * 获取分组信息
 */
export const getGroups = (location:GroupsLocation) => {
    const msg = {
        type:'show_group',
        param:{
            location
        }
    };

    return requestAsync(msg).then(res => {
        const groups = parseAllGroups(location,res.groupInfo);
        console.log('groups ========',groups);
        const groupsMap = getStore('mall/groups');
        groupsMap.set(location,groups);
        setStore('mall/groups',groupsMap);
    });
};

// 获取商品详细信息
export const getGoodsDetails = (goodsId:number) => {
    const msg = {
        type:'get_goods',
        param:{
            goodsIds:[goodsId]
        }
    };

    return requestAsync(msg).then(res => {
        console.log('getGoodsDetails ======',res);
    });
};

/**
 * 加入购物车
 */
export const addCart = (goodId:number,amount:number,sku:string) => {
    const msg = {
        type:'get_goods',
        param:{
            good_id:goodId,
            amount,
            sku
        }
    };

    return requestAsync(msg).then(res => {
        console.log('addCart ======',res);
    });
};
// 获取地区信息
export const getAreas = () => {
    const msg = {
        type:'get_area',
        param:{
            ids:[121001]
        }
    };

    return requestAsync(msg).then(res => {
        console.log('getAreas ======',res);
    });
};

// 获取供应商信息
export const getSuppliers = (id:number) => {
    const msg = {
        type:'get_supplier',
        param:{
            ids:[id]
        }
    };

    return requestAsync(msg).then(res => {
        console.log('getSuppliers ======',res);
    });
};

// 获取收货人地址列表
export const getAddresses = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const address:Address = {
                id:1,		
                name:'陈二狗',       
                tel:'18324648321',       
                area:'四川省',        
                address:'四川省成都市高新区天府三街1140号17栋5-33号'  	
            };
            setStore('mall/addresses',[address]);
            resolve();
        },200);
    });
};

// 获取各种状态的订单
export const getOrders = () => {
    return 0;
};
/**
 * 获取收益统计
 */
export const getEarningTotal = () => {
    const msg = {
        type:'mall/members@earnings_total',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 获取海宝列表
 */
export const getHBaoList = (year?:number,month?:number) => {
    let param = {};
    if (year) {
        param = {
            year: year,
            month: month
        };
    }
    const msg = {
        type:'mall/members@haibao_details',
        param:param
    };

    return requestAsync(msg);
};

/**
 * 获取伙伴列表
 */
export const getPartnerList = (year?:number,month?:number) => {
    let param = {};
    if (year) {
        param = {
            year: year,
            month: month
        };
    }
    const msg = {
        type:'mall/members@partner_details',
        param:param
    };

    return requestAsync(msg);
};

/**
 * 获取收益列表
 * ttype  1:现金,2:海贝,3:积分
 */
export const getEarningList = (year:number,month:number,ttype:number) => {
    const msg = {
        type:'mall/members@earnings_log',
        param:{
            year: year,
            month: month,
            type:ttype
        }
    };

    return requestAsync(msg);
};

/**
 * 获取邀请码
 */
export const getInviteCode = () => {
    const msg = {
        type:'mall/members@get_invitation_code',
        param:{}
    };

    return requestAsync(msg);
};