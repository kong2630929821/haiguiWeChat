import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { checkWithdraw } from '../../net/pull';
import { getStore } from '../../store/memstore';

/**
 * 我的现金
 */
export class MyCash extends Widget {
    public props:any = {
        balance:getStore('balance/cash',0),
        ableWithdraw:false
    };

    public create() {
        super.create();
        checkWithdraw().then(r => {
            this.props.ableWithdraw = true;
            this.paint();
        });
    }

    // 现金明细
    public goDetail() {
        popNew('app-view-mine-balanceLog');
    }

    // 提现
    public withdraw() {
        if (this.props.ableWithdraw || this.props.balance === 0) {
            popNew('app-view-mine-withdraw');
        }
    }
}