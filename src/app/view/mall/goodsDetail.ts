import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { addCart, getGoodsDetails, getSuppliers } from '../../net/pull';
import { GoodsDetails, setStore } from '../../store/memstore';
import { calcPrices, getImageMainPath, popNewMessage, priceFormat } from '../../utils/tools';

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
            priceFormat,
            getImageMainPath,
            descProps:undefined,   
            chooseSpec:false,
            amount:1,              // 选择数量
            skuIndex:-1

        };
        super.setProps(this.props);
        getSuppliers(props.goods.supplier);
        console.log('GoodsDetailHome',this.props);
        getGoodsDetails(props.goods.id).then(goods => {
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
        this.props.skuIndex = res.skuIndex;
        this.props.amount = res.amount;
        this.props.chooseSpec = false;
        this.paint();
    }
    
    // 加入购物车
    public pushShoppingCart() {
        const sku = this.props.goods.labels[this.props.skuIndex];
        addCart(this.props.goods.id,this.props.amount,sku[0]).then(() => {
            popNewMessage('添加成功');
        });
    }

    // 立即购买
    public buyNow() {
        // const cartGood:CartGoods = {
        //     goods:this.props.goods,
        //     amount:this.props.amount,
        //     labels:this.props.fixedLabels.concat(this.props.hasLabels),
        //     selected:true
        // };
        // const cartGoods = [cartGood];
        // setStore('mall/cartGoods',cartGoods);

        // popNew('app-view-shoppingCart-confirmOrder',{ orderGoods:cartGoods });
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
