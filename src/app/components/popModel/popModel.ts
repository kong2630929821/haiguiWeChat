import { Widget } from '../../../pi/widget/widget';

/**
 * 弹窗口
 */
export class PopModel extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public cancelClick() {
        this.cancel && this.cancel();
    }

    public okClick() {
        this.ok && this.ok();
    }
}