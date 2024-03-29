import { onlyWXPay, whiteGoodsId_399A, whiteGoodsId_399B } from '../config';
import { getAllMessage, getCollectList, payMoney, upgradeHBao, upgradeHWang } from '../net/pull';
import { getStore, setStore, UserType } from '../store/memstore';
import { popNewMessage } from './tools';
/**
 * 本地方法
 */
declare var WeixinJSBridge;

/**
 * 仿造index.html中的loadJS写的一个更简单的版本
 */
export const loadJS = (url: string, cb: (result: any) => void) => {
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    const scriptNode = document.createElement('script');
    scriptNode.charset = 'utf8';
    scriptNode.onerror = () => {
        scriptNode.onload = scriptNode.onerror = undefined;
        head.removeChild(scriptNode);
        cb({ result: -1, url: url });
    };
    scriptNode.onload = () => {
        scriptNode.onload = scriptNode.onerror = undefined;
        head.removeChild(scriptNode);
        cb({ result: 1, url: url });
    };
    scriptNode.async = true;
    scriptNode.src = url;
    head.appendChild(scriptNode);
};

/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分， 2 返回月日， 3 返回月日时分， 4 返回月日时分 
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }
    if (timeType === 2) {
        return `${month}月${day}日`;
    }
    if (timeType === 3) {
        return `${month}月${day}日 ${hour}:${minutes}`;
    }
    if (timeType === 4) {
        return `${month}-${day} ${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * 打开微信支付
 */
export const openWXPay = (param:any,ok?:Function,failed?:Function) => {
    const onBridgeReady = () => {
        console.log('WeixinJSBridge has ready');

        WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(param), (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                ok && ok();

            } else {
                failed && failed();
            }
        });
    };

    if (WeixinJSBridge === 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      
    } else {
        onBridgeReady();
    }
};

/**
 * 获取会员等级名称
 */
export const getUserTypeShow = (user?:UserType) => {
    
    const curUser = getStore('user/userType',0);
    if (!user) user = curUser;
    if (curUser === UserType.hWang) return getStore('user/label','海王会员');
    if (user === UserType.hWang) return '海王会员';
    if (user === UserType.hBao) return '海宝会员';
    
    return '';
};

// 现金来源类型
export enum CashLogType {
    upHwang = 1,  // 其他人升级海王获得收益
    upHbao,    // 其他人升级海宝获得收益
    reShop,   // 购物返利
    reInvite,  // 邀请返利
    recharge,   // 充值
    withdraw,  // 提现
    shopping,    // 购物
    reCash,     // 提现退款
    other,       // 其他
    turntable,    // 大转盘
    shopReturn,     // 购物退款
    manage,        // 管理端调整
    hBaoGoods      // 399商品返利
}
// 现金来源名称
export const CashLogName = {
    upHwang:'升级海王',
    upHbao:'升级海宝',
    reShop:'购物返利',
    reInvite:'邀请返利',
    recharge:'充值',
    withdraw:'提现',
    shopping:'购物',
    reCash:'提现退款',
    other:'其他',
    turntable:'大转盘',
    shopReturn:'退款',
    manage:'客服调整',
    hBaoGoods:'399商品返利'
};

/**
 * 获取现金来源名称
 * @param ttype type
 */
export const getCashLogName = (ttype:number) => {
    return CashLogName[CashLogType[ttype]];
};

/**
 * 升级海宝支付
 */
export const payToUpHbao = (sel:string,cb?:any) => {
    const fee = 39900; // 升级海宝的费用
    // const fee = 1;     // 测试费用
    let optional = whiteGoodsId_399A;
    if (sel === 'B') optional = whiteGoodsId_399B;

    if (onlyWXPay) {
        // 微信支付（正式服）
        payMoney(fee,'hBao',1,['mall/members@up_haibao',optional]);
       
    } else {
        // 用余额支付 (自测使用)
        const cash = getStore('balance/cash',0);
        if (cash > fee) {
            upgradeHBao(sel);
        } else {
            payMoney(fee - cash,'hBao',1,['mall/members@up_haibao',optional]);
        }
    }
};

/**
 * 申请开通海王
 */
export const applyToUpHwang = (sel:string) => {
    upgradeHWang(sel).then(() => {
        popNewMessage('成功发送海王申请');
    }).catch(err => {
        if (err.result === 4007) {
            popNewMessage('申请已在处理中');
        } else if (err.result === 4012) {
            popNewMessage('获取上级失败');
        } else {
            popNewMessage('发送海王申请失败');
        }
    });
};

/**
 * 获取上次选中的地址
 */
export const getLastAddress = () => {
    const list = getStore('mall/addresses');
    let selected = localStorage.getItem('addressIndex') ? Number(localStorage.getItem('addressIndex')) :0;
    if (selected >= list.length) selected = 0;
    
    return [list, selected, list[selected]];
};

/**
 * 判断名字中是否只含有中文或英文
 * @param name name
 */
export const judgeRealName = (name:string) => {
    return /^[\u4e00-\u9fa5a-zA-Z]+$/.test(name);
};

// 获取所有收藏
export const getCollect = () => {
    getCollectList().then((r:any) => {
        console.log('获取所有收藏',r);
        setStore('flags/collects',r);
    });
};

// 获取所有消息
export const getAllMessage10 = () => {
    getAllMessage('',10).then(r => {
        const id = JSON.parse(localStorage.getItem('messageStatus'));
        if (id) {
            // 非首次
            if (id !== r[0].id) {
                // 未读消息
                setStore('flags/message',true);
            }
        } else {
            // 首次获取
            localStorage.setItem('messageStatus',JSON.stringify(0));
            if (r.length) {
                setStore('flags/message',true);
            }
        }
        setStore('message',r);
    });
};