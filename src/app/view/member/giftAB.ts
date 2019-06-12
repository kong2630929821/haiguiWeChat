import { Widget } from '../../../pi/widget/widget';

interface Props {
    giftType:string;
}
/**
 * 弹窗口
 */
export class GiftAB extends Widget {
    public props:Props = {
        giftType:'A'
    };
    public cancel:() => void;
    // 取消
    public close() {
        this.cancel && this.cancel();
    }
}
