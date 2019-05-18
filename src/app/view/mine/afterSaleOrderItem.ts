import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { ReturnGoodsStatus } from '../../net/pull';
import { Order, OrderStatus } from '../../store/memstore';
import { calcPrices, getImageThumbnailPath, priceFormat } from '../../utils/tools';

export interface Props {
    order:Order;  // 订单
    status:OrderStatus;        // 订单状态
}
/**
 * 订单
 */
export class OrderItem extends Widget {
    public timer:number;
    public setProps(props:any) {
        
        this.props = {
            ...props,
            statusShow:statusShows[props.status],
            getImageThumbnailPath,
            priceFormat,
            calcPrices
        };
        super.setProps(this.props);
        console.log('orderdetailitem ====',this.props);
    }

    public btnClick(e:any,num:number) {
        notify(e.node,'ev-btn-click',{ btn: num,status:this.props.status });
    }

    public itemClick(e:any) {
        notify(e.node,'ev-item-click',null);
    }
}

const statusShows:any = {
    [ReturnGoodsStatus.CANRETURN]:{
        btn1:'',
        btn2:'申请售后',
        text:'客服稍后将与您联系'
    },
    [ReturnGoodsStatus.RETURNING]:{
        btn1:'',
        btn2:'',
        text:'客服稍后将与您联系'
    },
    [ReturnGoodsStatus.RETURNED]:{
        btn1:'',
        btn2:'',
        text:'退货完成'
    }
    
};