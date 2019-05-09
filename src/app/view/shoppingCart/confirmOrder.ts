import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CartGoods } from '../../store/memstore';

interface Props {
    orderGoods:CartGoods[];
}
/**
 * 确认订单
 */
export class ConfirmOrder extends Widget {

    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props
        };
        super.setProps(this.props,oldProps);
        console.log('ConfirmOrder ====',this.props);
    }
    public selectAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true,selected:0 });
    }
}