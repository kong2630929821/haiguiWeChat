import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

/**
 * 我的现金
 */
export class MyCash extends Widget {
    public props:any;

    public goDetail() {
        popNew('app-view-mine-balanceLog');
    }
}