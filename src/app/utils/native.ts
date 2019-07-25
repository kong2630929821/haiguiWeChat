/**
 * 一些底层操作
 */
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
        close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
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
