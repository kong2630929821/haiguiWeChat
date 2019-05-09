import { Widget } from '../../../pi/widget/widget';
import { getGoodsDetails } from '../../net/pull';
import { CartGoods, getStore, GoodsDetails, MallLabels, setStore } from '../../store/memstore';
import { calcPrices, popNewMessage } from '../../utils/tools';

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
        const [fixedLabels,choosedLabels,hasLabels]  = filterMallLabels(props.goods.labels);
        this.props = {
            ...props,
            ...ret,
            descProps:undefined,   
            chooseSpec:false,
            choosedLabels,          // 可供选择的标签
            hasLabels,               // 已经选择的标签
            fixedLabels,            // 固定选择的标签
            amount:1              // 选择数量

        };
        super.setProps(this.props);
        getGoodsDetails(props.goods).then(goods => {
            this.props.goods = goods;
            this.paint();
        });
    }

    // 点击描述
    public clickDescs(e:any,key:string) {
        this.props.descProps = this.goodsItemDescs[key];
        this.paint();
    }

    // 关闭描述
    public closeDescsClick() {
        this.props.descProps = undefined;
        this.paint();
    }

    // 选择规则
    public chooseSpecClick() {
        this.props.chooseSpec = true;
        this.paint();
    }

    // 选择规则关闭
    public specCloseClick(res:any) {
        this.props.chooseSpec = false;
        this.props.hasLabels = res.hasLabels;
        this.props.amount = res.amount;
        this.paint();
    }
    
    // 加入购物车
    public pushShoppingCart() {
        const cartGood:CartGoods = {
            goods:this.props.goods,
            amount:this.props.amount,
            labels:this.props.fixedLabels.concat(this.props.hasLabels),
            selected:false
        };
        const cartGoods = getStore('mall/cartGoods');
        cartGoods.push(cartGood);
        
        setStore('mall/cartGoods',cartGoods);
        popNewMessage('添加成功');
    }

    // 前往商城首页
    public gotoMallHome() {
        setStore('flags/gotoMallHome',true);
    }

    // 前往购物车
    public gotoShoppinigCart() {
        setStore('flags/gotoShoppinigCart',true);
    }
}

// 过滤固定标签和用户选择标签
const filterMallLabels = (labels:MallLabels[]) => {
    const fixedLabels = [];  // 固定标签
    const choosedLabels = [];  // 可供选择的标签
    const hasLabels = [];     // 默认选择的标签
    for (const label of labels) {
        if (label.childs.length > 0) {
            const childsLabel = [];
            for (let i = 0;i < label.childs.length;i++) {
                const childLabel = label.childs[i];
                childsLabel.push(childLabel);
                if (!i) hasLabels.push(childLabel);
            }
            choosedLabels.push([label,childsLabel]);
        } else {
            fixedLabels.push(label);
        }
    }

    return [fixedLabels,choosedLabels,hasLabels];
   
};