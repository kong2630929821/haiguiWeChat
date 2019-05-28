import { Widget } from '../../../pi/widget/widget';

/**
 * 确认特殊商品支付费用
 */
export class ConfirmPayIfo extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:any = {
        money:0
    };
    public create() {
        super.create();
        this.config = { value: { group: 'top' } };
    }
    // 确认
    public confirm() {
        this.ok && this.ok();
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }
}