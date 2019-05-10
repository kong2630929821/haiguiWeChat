import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { OrderStatus } from '../../../store/memstore';

/**
 * 我的首页
 */
export class Home extends Widget {
    public setProps(props:any) {
        this.props = {
            ...props,
            allStaus:[
                { name:'待付款',status:OrderStatus.PENDINGPAYMENT,img:'wallet.png' },
                { name:'待发货',status:OrderStatus.PENDINGDELIVERED,img:'goods.png' },
                { name:'待收货',status:OrderStatus.PENDINGRECEIPT,img:'truck.png' },
                { name:'已完成',status:OrderStatus.COMPLETED ,img:'order.png' },
                { name:'退货',status:OrderStatus.RETURN,img:'return.png' }
            ]
        };
        super.setProps(this.props);
    }

    public goAddress() {
        popNew('app-view-mine-addressList');
    }

    public itemClick(status:OrderStatus) {
        if (status === OrderStatus.RETURN) return;
        popNew('app-view-mine-orderList',{ activeStatus: status,allStaus:this.props.allStaus.slice(0,this.props.allStaus.length - 1) });
    }
}