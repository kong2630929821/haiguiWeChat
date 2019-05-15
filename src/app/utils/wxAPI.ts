/**
 * 小馒头重写了从微信分享链接的功能,代码来源于YSZZ项目
 */

// ===================================  导入
import { userAgent } from '../../pi/util/html';
import { getWX_sign, uploadFile } from '../net/pull';
import { loadJS } from './logic';
import { popNewMessage } from './tools';
 
// ===================================  导出

/**
 * 理论上程序一运行就需要调用该函数，去微信获取分享的API
 */
export const registerWXAPI = () => {
    let result:any = {};
    result = userAgent(result);
    if (result.browser.name === 'micromessenger') {
        loadJS('http://res2.wx.qq.com/open/js/jweixin-1.4.0.js', (info) => {
            if (info.result === 1) {
                if ((<any>self).wx) {
                    getWX_sign().then((resp:any) => {
                        resp = resp.json();
                        alert(JSON.stringify(resp));

                        if (resp.result !== 1) {
                            popNewMessage('获取微信API失败');
                            
                            return;
                        }
                        const json = JSON.parse(resp.value);
                        json.debug = false;
                        json.jsApiList = ['onMenuShareTimeline', 'hideMenuItems',
                            'onMenuShareAppMessage', 'chooseImage',
                            'uploadImage', 'getLocalImgData', 'scanQRCode'];
                        (<any>self).wx.config(json);
                    // 隐藏右上角菜单项
                        for (let i = 0; i < cbArr.length; i++) {
                            cbArr[i]();
                        }
                        (<any>self).wx.ready(() => {
                        // warn(logLevel,"config success");
                        // wx.hideOptionMenu();
                        // wx.hideAllNonBaseMenuItem();
                            for (let i = 0; i < cbArr.length; i++) {
                                cbArr[i]();
                            }
                            apiReady = true;
                            (<any>self).wx.hideMenuItems({
                                menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                            });
                        });
                        (<any>self).wx.error((res) => {
                        // warn(logLevel,"config验证失败");
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                        });
                    });
                }
            }
        });
    }
};

/**
 * 分享链接
 */
export const shareWithUrl = (title:string,desc:string, img:string, url: string, cb: () => void = null) => {
    const linkObj = {
        title: title,
        desc: desc,
        debug: true,
        link: url,
        imgUrl: img,
        success: () => {
            if (cb) cb();
        }
    };
    if (apiReady) {
        // 分享到朋友圈
        (<any>self).wx.onMenuShareTimeline(linkObj);
        (<any>self).wx.onMenuShareAppMessage(linkObj);
    } else {
        setCb(() => {
            (<any>self).wx.onMenuShareTimeline(linkObj);
            (<any>self).wx.onMenuShareAppMessage(linkObj);
        });
    }
};

/**
 * 选择图片
 * @param num 最多数量
 */
export const takeImage = (num:number,cb) => {
    if (!apiReady) {
        popNewMessage('获取微信API失败,无法拍照');
        
        return;
    }
    (<any>self).wx.chooseImage({
        count: num || 1,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
            cb(res.localIds[0]);// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片            
        },
        fail: (res) => {
            popNewMessage(`拍照失败, ${JSON.stringify(res)}`);
        }
    });
};

/**
 * 上传图片
 * @param imgid 本地ID
 * @param cb callback
 */
export const upImage = (imgid: string, cb: (serid: string) => void) => {
    if (!apiReady) {
        popNewMessage('获取微信API失败,无法上传图片');
        
        return;
    }
    (<any>self).wx.uploadImage({
        localId: imgid, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: (res) => {
            // 上传到服务器
            uploadFile(res.serverId).then((url) => {
                cb(url);
            });

        }, fail: (res) => {
            popNewMessage(`发送图片失败：, ${JSON.stringify(res)}`);
        }

    });
};

/**
 * 扫描二维码
 */
export const scanQR = (cb: (qr: string) => void) => {
    if (!apiReady) {
        popNewMessage('获取微信API失败,无法扫描');

        return;
    }
    (<any>self).wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res) => {
            cb(res.resultStr);// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片            
        },
        fail: (res) => {
            popNewMessage(`扫描失败, ${JSON.stringify(res)}`);
        }
    });
};

// ===================================  本地

const setCb = (cb: Function) => {
    cbArr.push(cb);
};
const cbArr: Function[] = [];
let apiReady: boolean = false;
// ===================================  执行
