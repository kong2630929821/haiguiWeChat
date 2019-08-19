import { Widget } from '../../../pi/widget/widget';
import { popNewMessage } from '../../utils/tools';
import { appPrivacyPolicy, privacyPolicy } from './privacyPolicyText';

interface Props {
    privacyPolicy: any;
    selected:boolean;
    appPriacypolicy:boolean;
}
/**
 * privacy policy
 */
export class PrivacyPolicy extends Widget {
    public ok: () => void;
    public props:Props = {
        privacyPolicy: privacyPolicy,
        selected:false,
        appPriacypolicy:false
    };
    public setProps(props:Props) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (this.props.appPriacypolicy) {
            this.props.privacyPolicy = appPrivacyPolicy;
        }
    }

    public confirm() {
        if (this.props.selected) {
            this.ok && this.ok();
        } else {
            popNewMessage('请先阅读并同意协议');
        }
    }

    public choose() {
        this.props.selected = !this.props.selected;
        this.paint();
    }

}