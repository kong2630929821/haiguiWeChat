import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

/**
 * 确认订单
 */
export class ConfirmOrder extends Widget {
    public props:any = {
        list:[1,2,3,4,5]
    };

    public selectAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true,selected:0 });
    }
}