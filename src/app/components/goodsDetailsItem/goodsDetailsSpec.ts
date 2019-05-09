import { Widget } from '../../../pi/widget/widget';
import { GoodsDetails, MallLabels } from '../../store/memstore';
import { calcPrices } from '../../utils/tools';

interface Props {
    goods:GoodsDetails;
}
/**
 * 规格选择
 */
export class GoodsDetailsSpec extends Widget {
    // tslint:disable-next-line:no-unnecessary-override
    public setProps(props:Props,oldProps:Props) {
        const ret = calcPrices(props.goods);
        const [fixedLabels,choosedLabels,hasLabels]  = filterMallLabels(props.goods.labels);
        const labelImage = filterShowLabelImage(props.goods.labels,hasLabels[0]);
        this.props = {
            ...props,
            ...ret,
            fixedLabels,
            choosedLabels,
            hasLabels,
            buyNumber:1,
            labelImage
        };
        super.setProps(this.props,oldProps);
        // console.log('GoodsDetailsItem ----------------',props);
    }

    // 选择标签
    public clickLableItem(e:any,i:number,j:number) {
        const labelName = this.props.choosedLabels[i][1][j];
        this.props.hasLabels[i] = labelName;
        this.props.labelImage = filterShowLabelImage(this.props.goods.labels,labelName);
        this.paint();
    }

    // 减少购买数量
    public lessClick() {
        const nowBuyNumber = this.props.buyNumber--;
        this.props.buyNumber === nowBuyNumber >= 1 ? nowBuyNumber : 1;
        this.paint();
    }

    // 增加购买数量
    public addClick() {
        const nowBuyNumber = this.props.buyNumber++;
        this.props.buyNumber === nowBuyNumber > this.props.goods.inventorys ? this.props.goods.inventorys : nowBuyNumber;
        this.paint();
    }

}

// 展示选择标签的图片
const filterShowLabelImage = (labels:MallLabels[],labelName:string) => {
    for (const label of labels) {
        for (let i = 0;i < label.childs.length;i++) {
            const childLabel = label.childs[i];
            if (childLabel.name === labelName) return childLabel.image;
        }
    }
};

// 过滤固定标签和用户选择标签
const filterMallLabels = (labels:MallLabels[]) => {
    const fixedLabels = [];  // 固定标签
    const choosedLabels = [];  // 可供选择的标签
    const hasLabels = [];     // 默认选择的标签
    for (const label of labels) {
        if (label.childs.length > 0) {
            const childsLabelName = [];
            for (let i = 0;i < label.childs.length;i++) {
                const childLabel = label.childs[i];
                childsLabelName.push(childLabel.name);
                if (!i) hasLabels.push(childLabel.name);
            }
            choosedLabels.push([label.name,childsLabelName]);
        } else {
            fixedLabels.push(label.name);
        }
    }

    return [fixedLabels,choosedLabels,hasLabels];
   
};