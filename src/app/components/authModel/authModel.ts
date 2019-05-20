import { Widget } from '../../../pi/widget/widget';

declare var WeixinJSBridge;
/**
 * 授权窗口
 */
export class AuthModel extends Widget {
    public cancelClick() {
        WeixinJSBridge.call('closeWindow');
    }

    public okClick() {
        const oldHref = location.href;
        const search = location.search;
        let newHref = '';
        if (search) {
            newHref = `${oldHref}&auth=t`;
        } else {
            newHref = `${oldHref}?auth=t`;
        }
        
        console.log('old href =',oldHref);
        console.log('new href = ',newHref);
        window.location.href = `${newHref}`;
    }
}