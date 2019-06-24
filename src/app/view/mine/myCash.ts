import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { checkWithdraw } from '../../net/pull';
import { getStore, register } from '../../store/memstore';
import { priceFormat } from '../../utils/tools';
export const forelet = new Forelet();
/**
 * 我的现金
 */
export class MyCash extends Widget {
    public props:any = {
        ableWithdraw:false
    };

    public create() {
        super.create();
        this.state = priceFormat(getStore('balance/cash',0));
        checkWithdraw().then(r => {
            this.props.ableWithdraw = this.state > 0;
            this.paint();
        });
    }

    // 现金明细
    public goDetail() {
        popNew('app-view-mine-balanceLog');
    }

    // 提现
    public withdraw() {
        if (this.props.ableWithdraw) {
            popNew('app-view-mine-withdraw');
        }
    }
}
register('balance',r => {
    forelet.paint(priceFormat(r.cash));
});