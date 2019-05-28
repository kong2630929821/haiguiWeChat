import { popNew } from '../../../../pi/ui/root';
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { copyToClipboard, popNewMessage } from '../../../utils/tools';
interface Props {
    name:string;
    money:string;
    code:string;
}
/**
 * 权益升级卡片
 */
export class PowerCard extends Widget {
    public props:Props;

    public update(e:any) {
        // popNew('app-view-member-turntable');
        notify(e.node,'ev-update',null);
    }

    public copy() {
        copyToClipboard(this.props.code);
        popNewMessage('复制成功');
    }
}