import { request } from '../../pi/net/ui/con_mgr';
import { baoSaleClassGoodsId, baoVipClassGoodsId, baoVipMaskGoodsId, freeMaskGoodsId, httpPort, OffClassGoodsId, sourceIp, sourcePort, wangSaleClassGoodsId, wangVipClassGoodsId, wangVipMaskGoodsId, whiteGoodsId_10000A, whiteGoodsId_10000B, whiteGoodsId_399A, whiteGoodsId_399B } from '../config';
import { getStore,GoodsDetails, GroupsLocation, OrderStatus, ReturnGoodsStatus, setStore, UserType } from '../store/memstore';
import {  judgeRealName, openWXPay } from '../utils/logic';
import { payByWx } from '../utils/native';
import { arrayBuffer2File, deelMessage, getUserType, popNewMessage, priceFormat, str2Unicode, timestampFormat, unicode2ReadStr, unicode2Str } from '../utils/tools';
import { requestAsync } from './login';
import { parseAddress, parseAddress2, parseAfterSale, parseAllGroups, parseArea, parseCart, parseFreight, parseGoodsDetail, parseOrder } from './parse';

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

/**
 * 分页获取商品信息
 */
export const getGoodsInfo = (group_id:number,goods_id:number) => {
    // const msg = {
    //     type:'get_goods_info',
    //     param:{
    //         group_id,
    //         goods_id,
    //         count:maxCount
    //     }
    // };

    // return requestAsync(msg).then(res => {
    //     const goods:GoodsDetails[] = [];
    //     for (const v of res.goodsInfo) {
    //         const good = parseGoodsDetail(v);
    //         goods.push(good);
    //     }
    //     console.log('get_goods_info ========',res);
    //     console.log('get_goods_info ========',goods);

    //     return goods;
    // });

    return fetch(`http://${sourceIp}:${httpPort}/goods/get_goods_info?uid=${getStore('user/uid',0)}&group_id=${group_id}&count=10000`).then(r => {
        return r.json().then(res => {
            const goods:GoodsDetails[] = [];
            for (const v of res.goodsInfo) {
                const good = parseGoodsDetail(v);
                goods.push(good);
            }

            return goods;
        });
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

// 猜你喜欢
export const guessYouLike = (count:number) => {
    const msg = {
        type:'guess_you_like',
        param:{
            count
        }
    };

    return requestAsync(msg).then(res => {
        if (!res.goodsInfo) return;
        const likeGoodsList = [];
        for (const v of res.goodsInfo) {
            const goods = parseGoodsDetail(v);
            likeGoodsList.push(goods);
        }
        let likedGoods = getStore('mall/likedGoods');
        likedGoods = likedGoods.concat(likeGoodsList);
        console.log('guessYouLike ======',likeGoodsList);
        setStore('mall/likedGoods',likedGoods);

        return likeGoodsList;
    }).catch(() => {
        
        return [];
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

        return carts;
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
    
        return res;
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
        const addresses = parseAddress2(res.addressInfo);
        console.log('delAddress ======',addresses);
        setStore('mall/addresses',addresses);

        return addresses;
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
        
        return addresses;
    });
};

/**
 * 获取运费信息
 * @param supplier 供应商ID
 * @param goods_type 商品类型 0 普通商品 1保税商品 2 海外直购
 */
export const getFreight = (supplier:number,goods_type:number) => {
    const msg = {
        type:'get_freight',
        param:{
            supplier,
            goods_type
        }
    };

    return requestAsync(msg).then(res => {
        const freights = parseFreight(res.freight_info);
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
    // const msg = {
    //     type:'get_order',
    //     param:{
    //         order_type
    //     }
    // };

    // return requestAsync(msg).then(res => {
    //     const orders = parseOrder(res.user_orderInfo);
    //     console.log('order ======',orders);
    //     const ordersMap = getStore('mall/orders');
    //     ordersMap.set(order_type,orders);
    //     setStore('mall/orders',ordersMap);
        
    //     return orders;
    // });

    return fetch(`http://${sourceIp}:${httpPort}/mall/get_order?uid=${getStore('user/uid')}&order_type=${order_type}`).then(res => {
        res.json().then(r => {
            const orders = parseOrder(r.user_orderInfo);
            console.log('order ======',orders);
            const ordersMap = getStore('mall/orders');
            ordersMap.set(order_type,orders);
            setStore('mall/orders',ordersMap);
        
            return orders;
        });
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
 * 确认收货
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
export const returnGoods = (aid:number,reason:string,image:string[]) => {
    const msg = {
        type:'return_goods',
        param:{
            aid,
            reason,
            image
        }
    };

    return requestAsync(msg).then(res => {
        console.log('returnGoods ======',res);
    });
};

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
        const infos = JSON.parse(res.value);
        if (!infos) {
            const afterSales = getStore('mall/afterSales');
            afterSales.set(rtype,[]);
            setStore('mall/afterSales',afterSales);
            
            return;
        }
        const orderIds = [];
        for (const info of infos) {
            orderIds.push(info[1]);
        }
        console.log('getReturnGoods ======',infos);

        return getOrderById(orderIds).then(orders => {
            const afterSaleOrders = parseAfterSale(infos,orders);
            console.log('afterSaleOrders ====',afterSaleOrders);
            const afterSales = getStore('mall/afterSales');
            afterSales.set(rtype,afterSaleOrders);
            setStore('mall/afterSales',afterSales);

            return afterSaleOrders;
        });
    });
};

// 获取订单详情
export const getOrderById = (oids:number[]) => {
    const msg = {
        type:'get_order_by_id',
        param:{
            oids
        }
    };

    return requestAsync(msg).then(res => {
        const orders = parseOrder(res.user_orderInfo);
        console.log('getOrderById ======',orders);

        return orders;
    });
};
/**
 * 获取收益统计
 */
export const getEarningTotal = async () => {
    const msg = {
        type:'mall/members@earnings_total',
        param:{}
    };

    const res = await requestAsync(msg);
    const data = [];
    res.wait_profit_detail.length && res.wait_profit_detail.forEach(v => {
        if (v[3]) {
            data.push(
                {
                    name:`${unicode2Str(v[1][0])} (购物返利)`,
                    time: timestampFormat(v[2]),
                    money: `￥${priceFormat(v[3])}`
                }
                );
        }
    });
    const earning = {
        baby: res.hbaoCount,
        cash: priceFormat(res.cash[0]),
        partner: res.partnerCount,
        shell: res.hbei[0],
        wait_profit: priceFormat(res.wait_profit[0]),
        rebate:data.reverse()
    };
    setStore('earning',earning);
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
 * @param t 1 只获取海王邀请码 2 只获取海宝邀请码 3 获取海王或海宝邀请码
 */
export const randomInviteCode = (t:number) => {
    const msg = {
        type:'mall/members@random_invitation_code',
        param:{
            type:t
        }
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
        cash: res.money[0],   // 现金，单位为分
        shell: res.haibei[0],
        integral: res.integral[0]
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
            name:'海龟壹号'
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
            wx_name:JSON.stringify(str2Unicode(name))
        }
    };

    return requestAsync(msg);
};

/**
 * 升级海宝
 */
export const upgradeHBao = (sel:string) => {
    let optional = whiteGoodsId_399A;
    if (sel === 'B') optional = whiteGoodsId_399B;
    const msg = {
        type:'mall/members@up_haibao',
        param:{
            optional
        }
    };

    return requestAsync(msg);
};

/**
 * 升级海王
 */
export const upgradeHWang = (sel:string) => {
    let optional = whiteGoodsId_10000A;
    if (sel === 'B') optional = whiteGoodsId_10000B;
    const msg = {
        type:'mall/members@up_haiwang',
        param:{
            optional
        }
    };

    return requestAsync(msg);
};

/**
 * 绑定用户 与邀请用户建立联系
 * @param code 父级邀请码
 * @param t 1 只绑定海王邀请码 2 只绑定海宝邀请码 3 可绑定海王或海宝邀请码
 */
export const bindUser = (code:string,t:number) => {
    const msg = {
        type:'mall/members@build_user',
        param:{
            code,
            type:t
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

    return requestAsync(msg).then(res => {
        const user = getStore('user');
        user.label = getUserType(res.level,res.label);
        user.avatar = res.avatar;
        user.userName = unicode2ReadStr(res.wx_name);
        // 正常中文名字则保留
        user.realName = judgeRealName(unicode2Str(res.name[0])) ? unicode2Str(res.name[0]) :'';
        user.IDCard = res.name[1];  // 身份证ID
        user.phoneNum = res.phone;
        if (res.level < UserType.other) {
            user.fcode = res.fcode;  // 上级的邀请码
            user.hwcode = res.hwcode;// 上级海王邀请码
        } 
        setStore('user',user);
        
        return res;
    });
};

/**
 * 发起支付
 * @param money 金额 单位分
 * @param ttype 支付类型 | 海宝
 * @param count 数量
 * @param ext 回传参数
 */
export const payMoney = (money:number,ttype:string,count:number= 1,ext?:any,failed?:Function) => {
    const flag = window.sessionStorage.appInflag;
    let channel = 'wxpay';    // 公众号内支付
    if (flag) channel = 'wx_app_pay';   // APP内支付

    const msg = {
        type:'mall/pay@pay',
        param:{
            money:Math.floor(money),
            type:ttype,
            count,
            channel,
            ext
        }
    };

    request(msg, (resp: any) => {
        if (resp.type) {
            console.log(`错误信息为${resp.type}`);
            popNewMessage(`支付失败${resp.type}`);
        } else {
            if (flag) {
                payByWx(resp.ok,(r:any) => {
                    if (r.err_msg !== 'get_brand_wcpay_request:ok') {
                        failed && failed();
                    } else {
                        queryOrder(resp.oid);   // 查询订单是否支付成功
                    }
                });

            } else {
                openWXPay(resp.ok,resp.oid,failed);
            }
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
 * @param id 身份证号
 * @param front 身份证正面图片ID
 * @param back 身份证背面图片ID
 * @param valid_date 身份证有效期
 */
export const verifyIDCard = (name:string,id:string,front:string,back:string,valid_date:string) => {
    const msg = {
        type:'set_id_card',
        param:{
            name,
            id,
            front,
            back,
            valid_date
        }
    };

    return requestAsync(msg);
};

/**
 * 上传文件 微信上传
 */
export const uploadFile = (id:string) => {

    return fetch(`http://${sourceIp}:${sourcePort}/service/upload/wx_file?serverId=${id}`).then(res => res.json());
};

/**
 * 上传文件 APP上传 TODO
 */
export const uploadFileApp = (buffer:ArrayBuffer) => {
    
    const formdata = new FormData();
    formdata.append('upload',arrayBuffer2File(buffer));
    formdata.append('path','phone');
    
    return fetch(`http://${sourceIp}:${sourcePort}/service/upload`, {
        body: formdata, 
        method: 'POST', 
        mode: 'cors' 
    }).then(res => res.json());
};

/**
 * 获取微信签名
 */
export const getWX_sign = (url:string) => {

    return fetch(`http://${sourceIp}:${sourcePort}/pt/wx/sign?url=${encodeURIComponent(url)}`).then(res => res.json());
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

// 获取物流公司编码  3993730228950
export const getExpressCompany = (sid:string) => {
    const msg = {
        type:'get_express_company',
        param:{
            LogisticCode:sid
        }
    };

    return requestAsync(msg).then(res => {
        const data = JSON.parse(res.ResponseData);
        console.log('getExpressCompany====',data);

        return data[0].comCode;    // 接口识别会返回一家或者多家快递公司，返回的数据根据快递鸟大数据分析结果排序，排名靠前的命中率更高。
        
    });
};

/**
 * 获取物流信息
 * @param LogisticCode 物流单号
 * @param ShipperCode 物流公司编码
 */
export const getExpressInfo = (LogisticCode:string,ShipperCode:string,phone:string) => {
    const msg = {
        type:'get_express_info',
        param:{
            LogisticCode,
            ShipperCode,
            phone
        }
    };

    return requestAsync(msg).then(res => {
        const data = JSON.parse(res.ResponseData);
        console.log('getExpressInfo====',data);

        return data.data || [];
        
    });
};

/**
 * 获取活动商品价格
 * @param goods 商品ID
 * @param addr 地址
 */
export const getActiveGoodsPrice = (goods:number, addr:number) => {
    const msg = {
        type:'mall/members@get_activity_goods',
        param:{
            goods_id: goods,
            addr_id: addr
        }
    };

    return requestAsync(msg);
};

/**
 * 购买活动商品
 * @param goods 商品ID, 商品数量, SKU 
 * @param addr 地址
 */
export const orderActiveGoods = (goods:[number,number,string],addr:number) => {
    const msg = {
        type:'order',
        param:{
            good_info: goods,
            address_no: addr
        }
    };

    return requestAsync(msg);
};

/**
 * 用户可领的所有礼包
 */
// tslint:disable-next-line:max-func-body-length
export const getAllGifts = async () => {
    const msg = {
        type:'mall/members@get_activity_goods_all',
        param:{}
    };
    
    try {
        const data = await requestAsync(msg);
        const memberGifts = getStore('user/memberGifts');
    
        for (const v of data.value) {
            if (v[0] === whiteGoodsId_399A) {
                memberGifts.gift = v[1];
                memberGifts.optionalGift = whiteGoodsId_399A;

            } else if (v[0] === whiteGoodsId_399B) {
                memberGifts.gift = v[1];
                memberGifts.optionalGift = whiteGoodsId_399B;

            } else if (v[0] === whiteGoodsId_10000A) {
                memberGifts.gift = v[1];
                memberGifts.optionalGift = whiteGoodsId_10000A;

            } else if (v[0] === whiteGoodsId_10000B) {
                memberGifts.gift = v[1];
                memberGifts.optionalGift = whiteGoodsId_10000B;

            } else if (v[0] === baoVipMaskGoodsId) {
                memberGifts.vipGift = v[1];

            } else if (v[0] === freeMaskGoodsId) {
                memberGifts.free = v[1];
            
            } else if (v[0] === OffClassGoodsId) {
                memberGifts.offClass = v[1];

            } else if (v[0] === baoVipClassGoodsId) {
                memberGifts.vipClass = v[1];

            } else if (v[0] === baoSaleClassGoodsId) {
                memberGifts.saleClass = v[1];
            
            } else if (v[0] === wangVipMaskGoodsId) {
                memberGifts.vipGift = v[1];

            } else if (v[0] === wangVipClassGoodsId) {
                memberGifts.vipClass = v[1];
            
            } else if (v[0] === wangSaleClassGoodsId) {
                memberGifts.saleClass = v[1];
            }
        }
    
        // 针对新版本迁移时未选择礼包的用户;，需要强制提示选择礼包;
        // const userType = getStore('user/userType');
        // if (userType === UserType.hBao && memberGifts.optionalGift === 0) {
        //     popNew('app-view-member-applyModalBox',{ needAddress:true,title:'礼包领取',unaccalimed:true },(data) => {
        //         let optional = whiteGoodsId_399A;
        //         if (data.sel === 'B') optional = whiteGoodsId_399B;
        //         confirmActivityGoods(optional, data.addr);
        //     });
        // }
        setStore('user/memberGifts',memberGifts);

        return memberGifts;
    } catch (err) {
        
        return false;
    }

};

// 获取抽奖次数
export const getNumberOfDraws = () => {
    const msg = {
        type:'mall/members@lottery_count',
        param:{}
    };

    return requestAsync(msg).then(r => {

        return r;
    }).catch(e => {
        console.log(e);
    });
};

// 抽奖
export const getDraws = () => {
    const msg = {
        type:'mall/members@lottery',
        param:{}
    };

    return requestAsync(msg).then(r => {
        return r;
    }).catch(e => {
        console.log(e);
    });
};

// 抽奖记录
export const getDrawsLog = () => {
    const msg = {
        type:'mall/members@lottery_log',
        param:{}
    };

    return requestAsync(msg).then(r => {
        return r;
    }).catch(e => {
        console.log(e);
    });
};

// 判断活动商品是否可以领取
export const judgeActivityGoods = (id:number) => {
    const msg = {
        type:'check_activity_goods',
        param:{
            id
        }
    };

    return requestAsync(msg).then(r => {

        return r;
    }).catch(e => {
        console.log('收藏商品错误',e);
    });
};

// 判断商品是否收藏
export const isCollectShop = (id:number) => {
    const msg = {
        type:'check_liked_goods',
        param:{
            id
        }
    };

    return requestAsync(msg).then(r => {

        return r;
    }).catch(e => {
        console.log('check_liked_goods',e);
    });
};

// 移除已经收藏的商品
export const removeLiked = (id:number) => {
    const msg = {
        type:'remove_liked_goods',
        param:{
            id
        }
    };

    return requestAsync(msg).then(r => {

        return r;
    }).catch(e => {
        console.log('remove_liked_goods',e);
    });
};

// 查看收藏的商品列表
export const getCollectList = () => {
    const msg = {
        type:'show_liked_goods',
        param:{}
    };

    return requestAsync(msg).then(r => {
        const goods:GoodsDetails[] = [];
        for (const v of r.goodsInfo) {
            const good = parseGoodsDetail(v);
            goods.push(good);
        }
        
        return goods;
    }).catch(e => {
        console.log('show_liked_goods',e);
    });
};

// 修改收货人信息
export const updateAddress = (name:string,tel:string,area_id:number,address:string,no:number) => {
    const msg = {
        type:'update_address',
        param:{
            name,
            tel,
            area_id,
            address,
            no
        }
    };

    return requestAsync(msg).then(r => {
        console.log('changeAddress ======',r);

        return r;
    }).catch(e => {
        console.log('update_address',e);
    });
};

// 设置默认收货地址
export const setDefaultAddr = (no:number) => {
    const msg = {
        type:'set_default_address',
        param:{
            no
        }
    };

    return requestAsync(msg);
};

// 收藏商品
export const collectShop = (id:number) => {
    const msg = {
        type:'add_liked_goods',
        param:{
            id
        }
    };

    return requestAsync(msg).then(r => {

        return r;
    }).catch(e => {
        console.log('收藏商品错误',e);
    });
};

/**
 * 搜索商品
 */
export const searchGoodsByName = (name:string) => {
    return fetch(`http://${sourceIp}:${httpPort}/goods/find_goods_name?uid=${getStore('user/uid')}&q=${name}`).then(r => r.json());
};

/**
 * 查询微信支付订单是否成功
 */
export const queryOrder = (oid:string) => {
    const msg = {
        type:'mall/pay@order_query',
        param:{
            oid
        }
    };

    return requestAsync(msg);
};

/**
 * 填入退货单号
 * @param aid 退货订单ID
 * @param ship_id 运单ID
 */
export const fillReturnGoodsId = (aid:number,ship_id:number) => {
    const msg = {
        type:'import_return_shipId',
        param:{
            aid,
            ship_id
        }
    };

    return requestAsync(msg);
};

// 获取大转盘梯度
export const getBigTurnrableConfig = () => {
    const msg = {
        type:'mall/members@get_lottery_out_config',
        param:{}
    };

    return requestAsync(msg);
};

// 查看提现是否开启
export const getWithdrawalStatus = () => {
    const msg = {
        type:'mall/members@get_withdraw_switch',
        param:{}
    };

    return requestAsync(msg);
};

// 获取提现配置
export const withdrawSetting = () => {
    const msg = {
        type:'mall/withdraw@get_withdraw_config',
        param:{}
    };

    return requestAsync(msg);
};

// 获取站内消息记录
export const getAllMessage = (start:any,count:number) => {
    const msg = {
        type:'mall/msg@get_inner_msg',
        param:{
            start,
            count
        }
    };

    return requestAsync(msg).then(r => {
        return deelMessage(r.msg_list);
    });
};