import { Widget } from '../../../pi/widget/widget';
import { Order } from '../../store/memstore';

interface Props {
    order:Order; 
}
/**
 * 物流详情
 */
export class Freight extends Widget {
    public setProps(props:Props) {
        this.props = {
            ...props
        };
        super.setProps(props);
        console.log('Freight ======',this.props);
    }
}