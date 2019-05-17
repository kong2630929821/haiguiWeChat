/**
 * 钱包登录模块
 */

import { open, request, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { wsUrl } from '../config';
import { getStore, GroupsLocation, setStore, UserType } from '../store/memstore';
import { registerWXAPI } from '../utils/wxAPI';
import { getAddress, getBalance, getCart, getEarningTotal, getExpressCompany, getExpressInfo, getFreight, getGroups, getInviteCode, getUserInfo } from './pull';
import { payComplete } from './push';

/**
 * 获取微信用户信息
 * 公众号环境下由后端通过微信授权后把用户信息挂到了localStorage.WXUSERINFO上,前端直接获取即可
 * 如果是浏览器环境，直接模拟一个WXUSERINFO
 */
const getWxUserInfo = () => {
    return JSON.parse(localStorage.WXUSERINFO);
};

/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
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
    userLogin();
};

/**
 * 连接出错回调
 */
const conError = (err) => {
    console.log('con error');
};

/**
 * 连接关闭回调
 */
const conClose = () => {
    console.log('con close');
};

/**
 * 重新连接回调
 */
const conReOpen = () => {
    console.log('con reopen');
};

/**
 * 用户登录
 */
const userLogin = () => {
    let userStr;
    let openId;
    if (location.search.indexOf('debug') >= 0) {
        openId = localStorage.getItem('openid');
        if (!openId) {
            openId = new Date().getTime();
            localStorage.setItem('openid',openId);
        }
        userStr = {
            openid:openId,
            headimgurl:'',
            nickname:'默认名字'
        };
    } else {
        userStr = getWxUserInfo().uinfo;
    }
    const msg = { 
        type: 'login', 
        param: { 
            type:1,
            user:userStr.openid,
            password:''
        } 
    };
    console.log('userLogin = ',msg);
    requestAsync(msg).then(r => {
        console.log('userLogin success = ',r);
        setStore('user/userType',r.level); // 用户会员等级
        for (const k in GroupsLocation) {
            if (parseInt(GroupsLocation[k]) >= 0) {
                getGroups(<any>GroupsLocation[k]);
            }
        }
        getCart();
        getAddress();  //
        getFreight();
        // 获取收益统计
        getEarningTotal().then(res => {
            const earning = getStore('earning');
            earning.baby = res.hbaoCount;
            earning.cash = res.cash;
            earning.partner = res.partnerCount;
            earning.shell = res.hbei;
            setStore('earning',earning);
        });
        // 只有海宝和海王才有邀请码
        if (r.level < UserType.normal) {  
            getInviteCode().then(res => {
                setStore('user/inviteCode',res.code);
            });
        }

        // 获取账户余额
        getBalance();

        // 获取用户信息
        getUserInfo().then(r => {
            const user = getStore('user');
            user.avatar = userStr.headimgurl;
            user.userName = r.wx_name || userStr.nickname;
            user.phoneNum = r.phone;
            setStore('user',user);
        });

        // 监听支付成功推送
        payComplete();
        
        // 注册微信api
        registerWXAPI();
    });
};
