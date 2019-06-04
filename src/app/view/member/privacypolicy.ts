import { Widget } from '../../../pi/widget/widget';
import { popNewMessage } from '../../utils/tools';
import { privacyPolicy } from './privacyPolicyText';

/**
 * privacy policy
 */
export class PrivacyPolicy extends Widget {
    public ok: () => void;
    public props:any;

    public setProps(props:any) {
        super.setProps(props);
        this.props =  {
            privacyPolicy: privacyPolicy,
            selected:false
        };
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