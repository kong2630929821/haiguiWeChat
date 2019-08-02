/**
 * 钱包登录模块
 */

import { open, reopen, request, setBottomLayerReloginMsg, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { popNew } from '../../pi/ui/root';
import { getCookie } from '../../pi/util/html';
import { maxCount, wsUrl } from '../config';
import { getStore, GroupsLocation, OrderStatus, setStore, UserType } from '../store/memstore';
import { getAllMessage10, getCollect } from '../utils/logic';
import { popNewMessage, unicode2ReadStr, unicode2Str } from '../utils/tools';
import { registerWXAPI } from '../utils/wxAPI';
import { getAddress, getAllGifts, getBalance, getCart, getEarningTotal, getGroups, getInviteCode, getOrders, getUserInfo, getWithdrawalStatus, guessYouLike, setUserName, withdrawSetting } from './pull';
import { payComplete } from './push';

document.addEventListener('visibilitychange', () => {
    console.log('visibilitychange',document.visibilityState);
    setTimeout(() => {
        const isLogin = getStore('user/isLogin');
        console.log('isLogin ===',isLogin);
        if (document.visibilityState === 'visible' && !isLogin) {
            reopen();
        }
    },100);
});
/**
 * 获取微信用户信息
 * 公众号环境下由后端通过微信授权后把用户信息挂到了localStorage.WXUSERINFO上,前端直接获取即可
 * 如果是浏览器环境，直接模拟一个WXUSERINFO
 */
export const getWxUserInfo = () => {
    const wxuserinfo = localStorage.WXUSERINFO;
    if (!wxuserinfo) {
        return;
    }
    
    return JSON.parse(wxuserinfo);
};

/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                // alert(`接口${JSON.stringify(msg)},错误信息为${JSON.stringify(resp)}`);
                reject(resp);

            } else if (resp.error === -69) {
                popNewMessage('请求超时');
                reject(resp);

            } else if (resp.result !== 1) {
                reject(resp);
                
            } else {
                resolve(resp);
            }
        });
    });
};

 // 设置重登录回调
setReloginCallback((res) => {
    const rtype = res.type;
    console.log('relogin ',rtype);
    if (rtype === 'logerror') {  //  重登录失败，登录流程重走一遍
        openConnect();
    } else {
        // 
        setStore('user/isLogin',true);
    }
});

/**
 * 开启连接
 */
export const openConnect = () => {
    setUrl(wsUrl);
    open(conSuccess,conError,conClose,conReOpen);
};

/**
 * 连接成功回调
 */
const conSuccess = () => {
    console.log('con Success');
    userLoginCheck();
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
    setStore('user/isLogin',false);
};

/**
 * 连接关闭回调
 */
const conClose = () => {
    console.log('con close');
    setStore('user/isLogin',false);
};

/**
 * 重新连接回调
 */
const conReOpen = () => {
    console.log('con reopen');
};

const userLoginCheck = () => {
    let userStr;
    let openId;
    if (location.search.indexOf('debug') >= 0) {
        openId = localStorage.getItem('openid');
        if (!openId) {
            openId = new Date().getTime().toString();
            localStorage.setItem('openid',openId);
        }
        userStr = {
            openid:openId,
            headimgurl:'',
            nickname:'默认名字'
        };
    } else {
        const wxuserInfo = getWxUserInfo();
        userStr = wxuserInfo && wxuserInfo.uinfo;
    }

    if (userStr) {
        userLogin(userStr);
    } else {
        popNew('app-components-authModel-authModel');   // 授权
    }
};

/**
 * 用户登录
 */
const userLogin = (userStr:any) => {
    const msg = { 
        type: 'login', 
        param: { 
            type:1,
            user:userStr.openid,
            password:getCookie('ZMSCID_WX') || ''
        } 
    };
    console.log('userLogin = ',msg);
    requestAsync(msg).then(r => {
        console.log('userLogin success = ',r);
        setStore('user/uid',r.uid, false);   // uid
        setBottomLayerReloginMsg(userStr.openid,1,r.password);
        setStore('user/isLogin',true);
        setStore('user/userType',r.level); // 用户会员等级
        for (const k in GroupsLocation) {
            if (parseInt(GroupsLocation[k]) >= 0) {
                getGroups(<any>GroupsLocation[k]);
            }
        }
        getCart();    // 购物车
        getAddress();  // 地址列表
        // getFreight();   // 运费列表
        guessYouLike(maxCount);
        
        // 获取订单
        getOrders(OrderStatus.PENDINGPAYMENT);
        getOrders(OrderStatus.PENDINGDELIVERED);
        getOrders(OrderStatus.PENDINGRECEIPT);
        // 获取收益统计
        getEarningTotal();
        
        // 获取账户余额
        getBalance();

        // 只有海宝和海王才有邀请码
        if (r.level < UserType.normal) {  
            getInviteCode().then(res => {
                setStore('user/inviteCode',res.code);
            });
        }

        // 获取用户信息
        getUserInfo().then(res => {
            const user = getStore('user');
            if (unicode2ReadStr(res.wx_name) !== userStr.nickname) {
                // 更新名字为用户当前的微信名
                setUserName(userStr.nickname);  
                user.userName = unicode2Str(userStr.nickname);
            }
            user.avatar = userStr.headimgurl;
            setStore('user',user);
        });

        // 监听支付成功推送
        payComplete();
        
        // 注册微信api
        registerWXAPI(() => {
            setStore('flags/wxReady',true);  // 微信jssdk准备好了
        });

        // 获取所有可领的礼包
        getAllGifts();

        // 查看提现是否开启
        getWithdrawalStatus().then(r => {
            console.log('首次登录查看是否开启提现',r);
            setStore('flags/withdrawal',r.state);
        });

        // 获取所有收藏
        getCollect();

        // 获取提现配置
        withdrawSetting().then(r => {
            const data = {
                singleLimit:r.withdraw_config[0],
                tariff:r.withdraw_config[1]
            };
            setStore('withdrawalSetting',data);
        });
        
        // 获取所有消息
        getAllMessage10();
    });
};