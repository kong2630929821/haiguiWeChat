import { Widget } from '../../../pi/widget/widget';
import { copyToClipboard, popNewMessage } from '../../utils/tools';

/**
 * 联系我们
 */
export class ContactUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.props = {
            data:[
                ['官方网站','http://www.haiguiyihao.com'],
                ['客服电话','13555555555'],
                ['客服微信','ajshsodjfk']
            ]
        };
    }

    public itemClick(ind:any) {
        copyToClipboard(this.props.data[ind][1]);
        popNewMessage('复制成功');
    }

    public copyBtn() {
        copyToClipboard('028-66266866');
        popNewMessage('复制成功');
    }
}