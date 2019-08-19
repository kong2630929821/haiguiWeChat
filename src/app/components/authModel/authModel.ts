import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { sourceIp, sourcePort } from '../../config';
import { getWXCode } from '../../utils/native';
import { popNewMessage } from '../../utils/tools';

declare var WeixinJSBridge;
interface Props {
    selected:boolean;
}
/**
 * 授权窗口
 */
export class AuthModel extends Widget {
    public props:Props = {
        selected:false
    };
    public cancelClick() {
        WeixinJSBridge.call('closeWindow');
    }

    public okClick() {
        if (!this.props.selected) {
            popNewMessage('请先阅读并同意协议');

            return;
        }
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

    // 勾选协议
    public choose() {
        this.props.selected = !this.props.selected;
        this.paint();
    }

    // 阅读协议
    public read() {
        popNew('app-view-member-privacypolicy',{ appPriacypolicy:true });
    }
}