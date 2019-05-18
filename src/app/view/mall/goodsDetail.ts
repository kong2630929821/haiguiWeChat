import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { addCart, getAreas, getGoodsDetails } from '../../net/pull';
import { Area, CartGoods, getStore, GoodsDetails, ImageType, register, setStore } from '../../store/memstore';
import { calcPrices, getImageMainPath, getImagePath, popNewMessage, priceFormat } from '../../utils/tools';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

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
        const skus = props.goods.labels;
        let skuIndex = -1;
        if (skus.length === 1) skuIndex = 0;
        this.props = {
            ...props,
            ...ret,
            cartGoodsLen:getStore('mall/cartGoods').length,
            priceFormat,
            getImageMainPath,
            descProps:undefined,   
            chooseSpec:false,
            amount:1,              // 选择数量
            skuIndex,
            buyNow:false,
            areaIcon:'',     // 国旗图标
            area:''          // 国家

        };
        super.setProps(this.props);
        console.log('GoodsDetailHome',this.props);
        getGoodsDetails(props.goods.id).then(goods => {
            this.props.goods = goods;
            this.paint();
        });
        getAreas(props.goods.area).then((area:Area) => {
            this.props.area = area.name;
            this.props.areaIcon = getImagePath(area.images,ImageType.ICON)[0];
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
    public chooseSpecClick(buyNow:boolean) {
        this.props.buyNow = buyNow;
        const skus = this.props.goods.labels;
        if (skus.length === 1) {
            this.sureClick({ buyNow });
        } else {
            this.props.chooseSpec = true;
            this.paint();
        }
    }

    // 选择规则关闭
    public specCloseClick(res:any) {
        this.props.skuIndex = res.skuIndex;
        this.props.amount = res.amount;
        this.props.chooseSpec = false;
        this.paint();
    }
    
    // 立即购买
    public sureClick(res:any) {
        const sku = this.props.goods.labels[this.props.skuIndex];
        if (res.buyNow) {
            console.log('立即购买');
            const goods = JSON.parse(JSON.stringify(this.props.goods));
            goods.labels = [sku];
            const cartGood:CartGoods = {
                index:-1,
                goods:this.props.goods,
                amount:this.props.amount,
                selected:true
            };
            const cartGoods = [cartGood];

            popNew('app-view-shoppingCart-confirmOrder',{ orderGoods:cartGoods,buyNow:true });
        } else {
            addCart(this.props.goods.id,this.props.amount,sku[0]).then(() => {
                popNewMessage('添加成功');
            });
        }
        
    }
    // 前往商城首页
    public gotoMallHome() {
        setStore('flags/gotoMallHome',true);
    }

    // 前往购物车
    public gotoShoppinigCart() {
        setStore('flags/gotoShoppinigCart',true);
    }

    public updateCartGoodsIcon(len:number) {
        this.props.cartGoodsLen = len;
        this.paint();
    }
}

// 购物车变动
register('mall/cartGoods',(cartGoods:CartGoods[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateCartGoodsIcon(cartGoods.length);
});