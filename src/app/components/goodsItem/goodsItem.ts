import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { GoodsDetails } from '../../store/memstore';
import { calcPrices } from '../../utils/tools';

interface Props {
    goods:GoodsDetails;    // 商品信息
}
/**
 * 商品展示
 */
export class GoodsItem extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        const ret = calcPrices(props.goods);
        this.props = {
            ...props,
            ...ret
        };
        super.setProps(this.props,oldProps);
        console.log('GoodsItem ----------------',this.props);
    }

    public goodsItemClick(e:any) {
        notify(e.node,'ev-item-click',{ goods:this.props.goods });
    }
}