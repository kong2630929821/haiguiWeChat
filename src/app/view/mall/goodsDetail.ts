import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { getGoodsDetails } from '../../net/pull';
import { GoodsDetails } from '../../store/memstore';
import { calcPrices } from '../../utils/tools';

interface Props {
    goods:GoodsDetails;     // 商品详情
}
/**
 * 商品详情
 */
export class GoodsDetailHome extends Widget {
    public goodsItemDescs:any = {
        freight:{ 
            title:'运费说明',
            descs:[
                { title:'运费说明',content:'普通运费10元，内蒙古自治区、海南省、西藏自治区、新疆维吾尔自治区运费20元' }
            ] 
        },
        tax:{ 
            title:'税费说明',
            descs:[
                { title:'商品进口税',content:'进口税=海关认定完税价*认定税率（完税价格由海关最终认定）' }
            ] 
        },
        service:{ 
            title:'服务说明',
            descs:[
                { title:'7天售后无忧',content:'收到商品之日起7天(含)内如有商品质量问题可申请售后进行退货' }
            ] 
        }
    
    };
    public setProps(props:Props,oldProps:Props) {
        const ret = calcPrices(props.goods);
        this.props = {
            ...props,
            ...ret,
            descProps:undefined
        };
        super.setProps(this.props);
        getGoodsDetails(props.goods).then(goods => {
            this.props.goods = goods;
            this.paint();
        });
    }

    public clickDescs(e:any,key:string) {
        this.props.descProps = this.goodsItemDescs[key];
        this.paint();
    }

    public closeDescsClick() {
        this.props.descProps = undefined;
        this.paint();
    }

    // 选择规则
    public chooseSpecClick() {
        popNew('app-components-goodsDetailsItem-goodsDetailsSpec',{ goods:this.props.goods });
    }
}