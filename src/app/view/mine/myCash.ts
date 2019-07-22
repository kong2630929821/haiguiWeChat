import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { checkWithdraw } from '../../net/pull';
import { getStore, register } from '../../store/memstore';
import { priceFormat } from '../../utils/tools';
export const forelet = new Forelet();

const STATE = {
    price:priceFormat(getStore('balance/cash',0)),
    ableWithdraw:false
};
/**
 * 我的现金
 */
export class MyCash extends Widget {
   
    public create() {
        super.create();
        this.state = STATE;
        // 开启提现
        checkWithdraw().then(r => {
            this.state.ableWithdraw = this.state.price > 0;
            this.paint();
        });  
    }

    // 现金明细
    public goDetail() {
        popNew('app-view-mine-balanceLog');
    }

    // 提现
    public withdraw() {
        // 开启提现
        if (this.props.ableWithdraw) {
            popNew('app-view-mine-withdraw');
        }
    }
}
register('balance',r => {
    STATE.price = priceFormat(r.cash);
    forelet.paint(STATE);
});

register('flags/withdrawal',r => {
    STATE.ableWithdraw = r.withdrawal;
    forelet.paint(STATE);
});