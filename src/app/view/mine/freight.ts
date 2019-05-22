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
        const shipId = props.order.ship_id.split('/')[0];

        this.props = {
            ...props,
            shipId,
            ShipperName:'',
            traces:[],
            shipTimeShow:timestampFormat(props.order.ship_time)
        };
        super.setProps(this.props);
        console.log('Freight ======',this.props);
        if (shipId) {
            getExpressCompany(shipId).then((ShipperCode:string) => {
                this.props.ShipperName = logisticsCode[ShipperCode] || '未知';
                this.paint();
                getExpressInfo(shipId,ShipperCode,props.order.tel).then(res => {
                    console.log(res);
                    this.props.traces = res;
                    this.paint();
                });
            });
        }
    }

    public copyClick() {
        copyToClipboard(this.props.shipId);
        popNewMessage('复制成功');
    }
}