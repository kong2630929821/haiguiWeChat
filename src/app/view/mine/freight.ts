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
        const shipId = props.order.ship_id.split(/[,|，\/]/);   // 分隔符 拆分多个物流单号

        this.props = {
            ...props,
            shipId,
            ShipperName:[],
            traces:[],
            shipTimeShow:timestampFormat(props.order.ship_time)
        };
        super.setProps(this.props);
        console.log('Freight ======',this.props);
        this.init(shipId, 0);
    }

    public init(shipId:string[], i:number) {
        if (shipId.length > i) {
            const id = shipId[i].split(/[:|：]/)[0];
            getExpressCompany(id).then((ShipperCode:string) => {
                this.props.ShipperName[i] = logisticsCode[ShipperCode] || '未知';
                this.paint();
                getExpressInfo(id, ShipperCode, this.props.order.tel).then(res => {
                    console.log(res);
                    this.props.traces[i] = res;
                    this.paint();
                    this.init(shipId,++i);
                });
            });
        }
    }

    public copyClick() {
        copyToClipboard(this.props.shipId);
        popNewMessage('复制成功');
    }
}