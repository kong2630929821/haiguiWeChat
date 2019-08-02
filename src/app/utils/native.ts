/**
 * 一些底层操作
 */
import { ImagePicker } from '../../pi/browser/imagePicker';
import { QRCode } from '../../pi/browser/qrcode';
import { ShareToPlatforms } from '../../pi/browser/shareToPlatforms';
import { WebViewManager } from '../../pi/browser/webview';
import { WeChatLogin } from '../../pi/browser/wxlogin';
import { popNewLoading } from './tools';

/**
 * 选择图片
 * @param ok ok
 * @param cancel cancel 
 */
export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const imagePicker = new ImagePicker();
    imagePicker.init();
    imagePicker.selectFromLocal({
        success: (width, height, url) => {
            ok && ok(width, height, url);
            close && close.callback(close.widget);
        },
        fail: (result) => {
            cancel && cancel(result);
            close && close.callback(close.widget);
        },
        useCamera: 1,
        single: 1,
        max: 1
    });
    let close;
    setTimeout(() => {
        close = popNewLoading('导入中');
    },100);
    
    return imagePicker;
};

/**
 * 二维码扫描
 */
export const doScanQrCode = (ok?,cancel?) => {
    const qrcode = new QRCode();
    qrcode.init();
    qrcode.scan({
        success: (res) => {
            ok && ok(res);
            console.log('scan-------------',res);
        },
        fail: (r) => {
            cancel && cancel();
            console.log(`scan fail:${r}`);
        }
    });
    qrcode.close({
        success: (r) => {
            console.log(`close result:${r}`);
        }
    });
    
};

/**
 * 打开新网页
 */
export const openNewActivity = (url:string,title:string= '') => {
    WebViewManager.open(title, `${url}?${Math.random()}`, title, '');
};

/**
 * 截屏
 */
export const makeScreenShot = (okCB?,errCB?) => {
    ShareToPlatforms.makeScreenShot({
        success: (result) => { 
            okCB && okCB(result);
        },
        fail: (result) => { 
            errCB && errCB(result);
        }
    });
    
};

/**
 * 将APP注册到微信
 */
export const registerToWx = (appId:string) => {
    console.log('registerToWx!!!!!!',appId);
    WeChatLogin.regToWx(appId);
};
registerToWx('wx352b4d158651ccf2');   // 加载就立即调用

/**
 * 从微信APP获取临时凭证Code
 */
export const getWXCode = (ok?:any) => {
    WeChatLogin.getCodeFromWX('snsapi_userinfo','',(res,code,state) => {
        console.log('getWXCode!!!!!!',res,code,state);
        ok && ok(code);
    });
};

/**
 * goWXPay 微信支付
 * 
 * @param app_id ：微信开发平台的appID
 * @param partnerid : 微信支付分配的商户号
 * @param prepayid : 微信返回的支付会话ID
 * @param packages : 扩展字段，暂时填写 "Sign=WXPay" 固定值
 * @param noncestr : 随机字符串
 * @param timestamp ：时间戳
 * @param sign ：签名
 * @param success : 成功回调
 * @param result ：0：充值成功， -1： 充值错误（参数异常）  -2： 用户选择取消
 */
export const payByWx = (param:string,ok?:any) => {
    const r = JSON.parse(param);
    WeChatLogin.goWXPay(r.appid,r.partnerid,r.prepayid,r.package,r.noncestr,r.timestamp,r.sign,(res) => {
        console.log('payByWx!!!!!!!!',res);
        ok && ok(res);
    });
};