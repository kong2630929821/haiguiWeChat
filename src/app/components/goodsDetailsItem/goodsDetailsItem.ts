import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;   // 
    content:string; 
    style:string;
}
/**
 * 商品详情页 运费 服务等条目
 */
export class GoodsDetailsItem extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props
        };
        super.setProps(this.props,oldProps);
        // console.log('GoodsDetailsItem ----------------',props);
    }
}