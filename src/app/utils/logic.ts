import { getInviteCode, payMoney, upgradeHBao } from '../net/pull';
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
export const openWXPay = (param:any,failed?:Function) => {
    const onBridgeReady = () => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(param), (res) => {
            alert(JSON.stringify(res));
            if (res.err_msg) {
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
    if (!user) user = getStore('user/userType',0);
    if (user === UserType.hWang) return '海王';
    if (user === UserType.hBao) return '海宝';
    
    return '';
};

// 现金来源类型
enum CashLogType {
    upHwang = 1,  // 其他人升级海王获得收益
    upHbao,    // 其他人升级海宝获得收益
    reShop,   // 购物返利
    reInvite,  // 邀请返利
    recharge,   // 充值
    withdraw,  // 提现
    shopping,    // 购物
    reCash     // 提现退款
}
// 现金来源名称
const CashLogName = {
    upHwang:'升级海王',
    upHbao:'升级海宝',
    reShop:'购物返利',
    reInvite:'邀请返利',
    recharge:'充值',
    withdraw:'提现',
    shopping:'购物',
    reCash:'提现退款'
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
export const payToUpHbao = () => {
    const cash = getStore('balance/cash');
    if (cash < 39900) { 
        payMoney(39900 - cash,'hBao');
    } else {
        upgradeHBao().then(() => {
            popNewMessage('升级海宝成功');
            setStore('user/userType', UserType.hBao);
            getInviteCode().then(res => {
                setStore('user/inviteCode',res.code);
            });
        });
    }
};

/**
 * 获取上次选中的地址
 */
export const getLastAddress = () => {
    const list = getStore('mall/addresses');
    let selected = localStorage.getItem('addressIndex') ? Number(localStorage.getItem('addressIndex')) :0;
    if (selected > list.length) selected = 0;

    return [list, selected, list[selected]];
};