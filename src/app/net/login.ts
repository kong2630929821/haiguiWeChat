/**
 * 钱包登录模块
 */

import { open, request, setReloginCallback, setUrl } from '../../pi/net/ui/con_mgr';
import { wsUrl } from '../config';
import { getGroups } from './pull';
// tslint:disable-next-line:max-line-length

/**
 * 获取微信用户信息
 * 公众号环境下由后端通过微信授权后把用户信息挂到了localStorage.WXUSERINFO上,前端直接获取即可
 * 如果是浏览器环境，直接模拟一个WXUSERINFO
 */
const getWxUserInfo = () => {
    if (!localStorage.WXUSERINFO) {
        localStorage.WXUSERINFO = `{"sid":"4tZ9bjUNgkkuLZiRCskRRUsgyQzyC7vGKHZa", "uinfo":{"openid":"oazhW5yQ5w8-WiQDi8qPTCNfKoGM","nickname":"彬","sex":1,"language":"zh_CN","city":"成都","province":"四川","country":"中国","headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/tmVLphkQHLwj0sykp4TkHXbtn917J6BoTq3QNVc49NkVY6ibA1lCMO3Y6AtUPSYEpt0dATg0sdCh4Z4WH3FpaTA/132","privilege":[]}}`;
    }

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
    const userStr = JSON.stringify(getWxUserInfo().uinfo);
    const msg = { 
        type: 'login', 
        param: { 
            type:1,
            user:userStr,
            password:''
        } 
    };
    console.log('userLogin = ',msg);
    requestAsync(msg).then(r => {
        console.log('userLogin success = ',r);
        getGroups();
    });
};
