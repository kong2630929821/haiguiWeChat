import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { getImageThumbnailPath, priceFormat } from '../../utils/tools';
import { SplitOrder } from './confirmOrder';

interface Props {
    splitOrder:SplitOrder;
}
/**
 * 拆分订单页面
 */
export class SplitOrderPage extends Widget {
    public setProps(props:Props,oloProps:Props) {
        this.props = {
            ...props,
            getImageThumbnailPath,
            priceFormat,
            mallImagPre
        };
        super.setProps(this.props);
        console.log('SplitOrderPage props',this.props);
    }
}