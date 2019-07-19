import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { AfterSale, ReturnGoodsStatus } from '../../store/memstore';
import { calcPrices, getImageThumbnailPath, priceFormat } from '../../utils/tools';

export interface Props {
    afterSaleOrder:AfterSale;  // 订单
    status:ReturnGoodsStatus;        // 订单状态
}
/**
 * 退货订单
 */
export class OrderItem extends Widget {
    public timer:number;
    
    public setProps(props:any) {
        statusShows[ReturnGoodsStatus.RETURNED].text2 = `退货失败: ${props.afterSaleOrder.refuseReason}`;
        statusShows[ReturnGoodsStatus.RETURNING].btn2 = props.afterSaleOrder.shipId ? '查看物流' :'填运单号';
        this.props = {
            ...props,
            statusShow:statusShows[props.status],
            getImageThumbnailPath,
            priceFormat,
            calcPrices,
            ReturnGoodsStatus,
            mallImagPre
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
        text:'客服稍后会处理'
    },
    [ReturnGoodsStatus.RETURNING]:{
        btn1:'',
        btn2:'填货运单号'
    },
    [ReturnGoodsStatus.RETURNED]:{
        btn1:'',
        btn2:'',
        text:'退货完成',
        text1:'退货成功',
        text2:'退货失败'
    }
    
};