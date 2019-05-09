import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { GoodsDetails, MallLabels } from '../../store/memstore';
import { calcPrices } from '../../utils/tools';

interface Props {
    goods:GoodsDetails;
    choosedLabels:MallLabels[];    // 可供选择的标签
    hasLabels:MallLabels[];    // 已经选择的标签
    amount:number;           // 选择数量

}
/**
 * 规格选择
 */
export class GoodsDetailsSpec extends Widget {
    public setProps(props:Props,oldProps:Props) {
        const ret = calcPrices(props.goods);
        const labelImage = filterShowLabelImage(props.goods.labels,props.hasLabels[0]);
        this.props = {
            ...props,
            ...ret,
            labelImage
        };
        super.setProps(this.props,oldProps);
    }

    // 选择标签
    public clickLableItem(e:any,i:number,j:number) {
        const label = this.props.choosedLabels[i][1][j];
        this.props.hasLabels[i] = label;
        this.props.labelImage = filterShowLabelImage(this.props.goods.labels,label);
        this.paint();
    }

    // 减少购买数量
    public lessClick() {
        const nowAmount = --this.props.amount;
        this.props.amount = nowAmount >= 1 ? nowAmount : 1;
        this.paint();
    }

    // 增加购买数量
    public addClick(e:any) {
        const nowAmount = ++this.props.amount;
        this.props.amount = nowAmount > this.props.goods.inventorys ? this.props.goods.inventorys : nowAmount;
        this.paint();
    }

    // 关闭
    public closeClick(e:any) {
        notify(e.node,'ev-close-spec',{ amount:this.props.amount,hasLabels:this.props.hasLabels });
    }

    // 加入购物车
    public pushShoppingCart(e:any) {
        this.closeClick(e);
        notify(e.node,'ev-push-shopping-cart',undefined);
    }

}

// 展示选择标签的图片
const filterShowLabelImage = (labels:MallLabels[],labeled:MallLabels) => {
    for (const label of labels) {
        for (let i = 0;i < label.childs.length;i++) {
            const childLabel = label.childs[i];
            if (childLabel.name === labeled.name) return childLabel.image;
        }
    }
};
