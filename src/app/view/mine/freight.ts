import { Widget } from '../../../pi/widget/widget';
import { getExpressCompany, getExpressInfo } from '../../net/pull';
import { Order } from '../../store/memstore';
import { copyToClipboard, popNewMessage, timestampFormat } from '../../utils/tools';
import { logisticsCode } from './logisticsCode';

interface Props {
    order:Order; 
}
/**
 * 物流详情
 */
export class Freight extends Widget {
    public setProps(props:Props) {
        this.props = {
            ...props,
            ShipperName:'',
            traces:[],
            shipTimeShow:timestampFormat(props.order.ship_time)
        };
        super.setProps(this.props);
        console.log('Freight ======',this.props);
        if (props.order.ship_id) {
            getExpressCompany(props.order.ship_id).then((ShipperCode:string) => {
                this.props.ShipperName = logisticsCode[ShipperCode] || '未知';
                this.paint();
                getExpressInfo(props.order.ship_id,ShipperCode,props.order.tel).then(res => {
                    console.log(res);
                    this.props.traces = res;
                    this.paint();
                });
            });
        }
    }

    public copyClick() {
        copyToClipboard(this.props.order.ship_id);
        popNewMessage('复制成功');
    }
}