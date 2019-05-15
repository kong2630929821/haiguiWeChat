import { request } from '../../pi/net/ui/con_mgr';
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

/**
 * 随机邀请码
 */
export const randomInviteCode = () => {
    const msg = {
        type:'mall/members@random_invitation_code',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 获取余额
 */
export const getBalance = () => {
    const msg = {
        type:'mall/members@balance',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 获取余额流水
 * ttype  1:现金,2:海贝,3:积分
 */
export const getBalanceList = (year:number,month:number,ttype:number) => {
    const msg = {
        type:'mall/members@balance_log',
        param:{
            year: year,
            month: month,
            type:ttype
        }
    };

    return requestAsync(msg);
};

/**
 * 邀请返利
 */
export const getInviteRebate = (id:number) => {
    const msg = {
        type:'mall/members@invitation_rebate',
        param:{
            goodsID:id
        }
    };

    return requestAsync(msg);
};

/**
 * 发送手机验证码
 */
export const sendCode = (phone:string) => {
    const msg = {
        type:'mall/sms@send_sms_code',
        param:{
            phone:phone,
            num:'86',
            name:'海归一号'
        }
    };

    return requestAsync(msg);
};

/**
 * 绑定手机号
 */
export const bindPhone = (phone:string,code:string) => {
    const msg = {
        type:'build_phone',
        param:{
            phone,
            code
        }
    };

    return requestAsync(msg);
};

/**
 * 设置用户昵称
 */
export const setUserName = (name:string) => {
    const msg = {
        type:'set_wx_name',
        param:{
            wx_name:name
        }
    };

    return requestAsync(msg);
};

/**
 * 升级海宝
 */
export const upgradeHBao = () => {
    const msg = {
        type:'mall/members@up_haibao',
        param:{
            wx_name:name
        }
    };

    return requestAsync(msg);
};

/**
 * 升级海王
 */
export const upgradeHWang = () => {
    const msg = {
        type:'mall/members@up_haiwang',
        param:{
            wx_name:name
        }
    };

    return requestAsync(msg);
};

/**
 * 绑定用户 与邀请用户建立联系
 */
export const bindUser = (code:string) => {
    const msg = {
        type:'mall/members@build_user',
        param:{
            code
        }
    };

    return requestAsync(msg);
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    const msg = {
        type:'get_user_info',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 微信支付
 * @param money 金额 单位分
 * @param ttype 商品ID | 海宝
 * @param count 数量
 */
export const wxPay = (money:number,ttype:string,count:number= 1) => {
    const msg = {
        type:'mall/pay@pay',
        param:{
            money:1,
            type:ttype,
            count,
            channel:'wxpay'
        }
    };

    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

/**
 * 申请提现
 * @param money 金额 单位分
 */
export const applyWithdraw = (money:number) => {
    const msg = {
        type:'mall/withdraw@application',
        param:{
            money
        }
    };

    return requestAsync(msg);
};

/**
 * 检查是否还有提现额度
 */
export const checkWithdraw = () => {
    const msg = {
        type:'mall/withdraw@check_withdraw',
        param:{}
    };

    return requestAsync(msg);
};

/**
 * 识别身份证
 */
export const verifyIDCard = (url:string) => {
    return fetch(`127.0.0.1:8091/wx/cmd/id_card?img_url=${url}`).then(response => response.json());
};