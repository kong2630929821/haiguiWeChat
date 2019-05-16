import { request } from '../../pi/net/ui/con_mgr';
import { sourceIp, sourcePort } from '../config';
import { getStore,GroupsLocation, OrderStatus, setStore } from '../store/memstore';
import { openWXPay } from '../utils/logic';
import { popNewMessage } from '../utils/tools';
import { requestAsync } from './login';
import { parseAddress, parseAddress2, parseAllGroups, parseArea, parseCart, parseFreight, parseGoodsDetail, parseOrder } from './parse';

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
        const goodsDetail = parseGoodsDetail(res.goodsInfo[0]);
        console.log('getGoodsDetails ======',goodsDetail);

        return goodsDetail;
    });
};

/**
 * 加入购物车
 */
export const addCart = (goodId:number,amount:number,sku:string) => {
    const msg = {
        type:'add_cart',
        param:{
            good_id:goodId,
            amount,
            sku
        }
    };

    return requestAsync(msg).then((res) => {
        console.log('addCart ======',res);
        const carts = parseCart(res.cartInfo);
        setStore('mall/cartGoods',carts);
        
        return carts;
    });
};

/**
 * 购物车减少
 */
export const deductCart = (no:number,amount:number) => {
    const msg = {
        type:'deduct_cart',
        param:{
            no,
            amount
        }
    };

    return requestAsync(msg).then((res) => {
        console.log('deductCart ======',res);
        const carts = parseCart(res.cartInfo);
        setStore('mall/cartGoods',carts);

        return carts;
    });
};

/**
 * 获取购物车
 */
export const getCart = () => {
    const msg = {
        type:'show_cart',
        param:{
        }
    };

    return requestAsync(msg).then(res => {
        console.log('getCart ======',res);
        const carts = parseCart(res.cartInfo);
        setStore('mall/cartGoods',carts);
    });
};

/**
 * 收货地址增加
 */
export const addAddress = (name:string,tel:string,area_id:number,address:string) => {
    const msg = {
        type:'add_address',
        param:{
            name,
            tel,
            area_id,
            address
        }
    };

    return requestAsync(msg).then(res => {
        console.log('addAddress ======',res);
        const addresses = parseAddress2(res.addressInfo);
        console.log('addAddress ======',addresses);
        setStore('mall/addresses',addresses);

        return address;
    });
};

/***
 * 删除收货地址
 */
export const delAddress = (no:number) => {
    const msg = {
        type:'del_address',
        param:{
            no
        }
    };

    return requestAsync(msg).then(res => {
        const addresses = parseAddress(res.addressInfo);
        console.log('delAddress ======',addresses);
        setStore('mall/addresses',addresses);

        return addAddress;
    });
};

/**
 * 获取收货地址
 */
export const getAddress = () => {
    const msg = {
        type:'get_address',
        param:{
        }
    };

    return requestAsync(msg).then(res => {
        const addresses = parseAddress(res.addressInfo);
        console.log('getAddress ======',addresses);
        setStore('mall/addresses',addresses);
        
        return addAddress;
    });
};

/**
 * 获取运费信息
 */
export const getFreight = () => {
    const msg = {
        type:'get_freight',
        param:{
        }
    };

    return requestAsync(msg).then(res => {
        const freights = parseFreight(res.addressInfo);
        console.log('getFreight ======',freights);
        setStore('mall/freights',freights);
        
        return freights;
    });
};

// 获取地区信息
export const getAreas = (id:number) => {
    const msg = {
        type:'get_area',
        param:{
            ids:[id]
        }
    };

    return requestAsync(msg).then(res => {
        const area = parseArea(res.areaInfo[0]);
        console.log('getAreas====',area);
        
        return area;
    });
};

/**
 * 下单
 */
export const order = (no_list:number[],address_no:number) => {
    const msg = {
        type:'order',
        param:{
            no_list,
            address_no
        }
    };

    return requestAsync(msg);
};

/**
 * 立即购买下单
 * @param good_info [商品id,数量,skuid]
 * @param address_no 地址索引
 */
export const orderNow = (good_info:[number,number,string],address_no:number) => {
    const msg = {
        type:'order',
        param:{
            good_info,
            address_no
        }
    };

    return requestAsync(msg);
};
/**
 * 支付
 */
export const payOrder = (oid:number) => {
    const msg = {
        type:'pay_order',
        param:{
            oid
        }
    };

    return requestAsync(msg);
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

// 获取各种状态的订单
export const getOrders = (order_type:OrderStatus) => {
    const msg = {
        type:'get_order',
        param:{
            order_type
        }
    };

    return requestAsync(msg).then(res => {
        const orders = parseOrder(res.user_orderInfo);
        console.log('order ======',orders);
        const ordersMap = getStore('mall/orders');
        ordersMap.set(order_type,orders);
        setStore('mall/orders',ordersMap);

        return orders;
    });
};

// 取消订单
export const cancelOrder = (oid:number) => {
    const msg = {
        type:'cancel_order',
        param:{
            oid
        }
    };

    return requestAsync(msg).then(res => {
        console.log('cancelOrder ======',res);
    });
};

/**
 * 收货
 */
export const receiptOrder = (oid:number) => {
    const msg = {
        type:'receipt',
        param:{
            oid
        }
    };

    return requestAsync(msg).then(res => {
        console.log('receiptOrder ======',res);
    });
};

/**
 * 退货
 */
export const returnGoods = (aid:number,reason:string) => {
    const msg = {
        type:'return_goods',
        param:{
            aid,
            reason
        }
    };

    return requestAsync(msg).then(res => {
        console.log('returnGoods ======',res);
    });
};

//  退货状态
export enum ReturnGoodsStatus {  
    CANRETURN = 0,   // 未退货
    RETURNING = 1,   // 退货中
    RETURNED = 2     // 已退货

}
/**
 * 获取退货信息
 */
export const getReturnGoods = (rtype:ReturnGoodsStatus) => {
    const msg = {
        type:'get_return_goods',
        param:{
            type:rtype
        }
    };

    return requestAsync(msg).then(res => {
        console.log('getReturnGoods ======',res);
    });
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
export const getBalance = async () => {
    const msg = {
        type:'mall/members@balance',
        param:{}
    };

    const res = await requestAsync(msg);
    const balance = {
        cash:res.money / 100,   // 现金，单位为分
        shell:res.haibei,
        integral:res.integral
    };
    setStore('balance',balance);
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
 * 发起支付
 * @param money 金额 单位分
 * @param ttype 商品ID | 海宝
 * @param count 数量
 */
export const payMoney = (money:number,ttype:string,count:number= 1) => {
    const msg = {
        type:'mall/pay@pay',
        param:{
            money:money,
            type:ttype,
            count,
            channel:'wxpay'
        }
    };

    request(msg, (resp: any) => {
        if (resp.type) {
            console.log(`错误信息为${resp.type}`);
            popNewMessage(`支付失败${resp.type}`);
        } else {
            openWXPay(resp.ok);
        }
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
export const identifyIDCard = (url:string) => {

    return fetch(`http://${sourceIp}:${sourcePort}/pt/wx/cmd/id_card?img_url=${encodeURIComponent(url)}`).then(res => res.json());
};

/**
 * 实名认证
 * @param name 姓名
 * @param card 身份证号
 * @param sid 身份证图片ID
 */
export const verifyIDCard = (name:string,card:string,sid:string) => {
    const msg = {
        type:'mall/withdraw@get_withdraw_log',
        param:{
            name,
            card,
            sid
        }
    };

    return requestAsync(msg);
};

/**
 * 上传文件
 */
export const uploadFile = (id:string) => {

    return fetch(`http://${sourceIp}:${sourcePort}/service/upload/wx_file?serverId=${id}`).then(res => res.json());
};

/**
 * 获取微信签名
 */
export const getWX_sign = () => {
    return fetch(`http://${sourceIp}:${sourcePort}/pt/wx/sign?url=${location.href}`).then(res => res.json());
};

/**
 * 查看提现状态
 */
export const getWithdrawStatus = (id:number) => {
    const msg = {
        type:'mall/withdraw@get_withdraw_log',
        param:{
            id
        }
    };

    return requestAsync(msg);
};