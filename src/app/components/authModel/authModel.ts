import { Widget } from '../../../pi/widget/widget';
import { sourceIp, sourcePort } from '../../config';
import { getWXCode } from '../../utils/native';

declare var WeixinJSBridge;
/**
 * 授权窗口
 */
export class AuthModel extends Widget {
    public cancelClick() {
        WeixinJSBridge.call('closeWindow');
    }

    public okClick() {
        const flag = window.sessionStorage.appInflag;
        if (flag) {
            getWXCode(code => {
                window.location.href = `http://${sourceIp}:${sourcePort}/pt/wx/app/oauth2?code=${code}&state=_${encodeURIComponent(window.location.href)}`;
            });

            return;
        }
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