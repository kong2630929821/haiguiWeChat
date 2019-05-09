import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    title:string;  
    descs:Desc[];   // 具体描述
}
interface Desc {
    title:string;
    content:string;
}
/**
 * 商品详情页 运费 服务等条目详细说明弹框
 */
export class GoodsDetailsItemDesc extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props
        };
        super.setProps(this.props,oldProps);
        // console.log('GoodsDetailsItem ----------------',props);
    }

    public closeClick(e:any) {
        notify(e.node,'ev-close-click',undefined);
    }
}