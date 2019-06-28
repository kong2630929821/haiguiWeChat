import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { addCart, getAreas, getGoodsDetails } from '../../net/pull';
import { Area, CartGoods, getStore, GoodsDetails, ImageType, register, setStore } from '../../store/memstore';
import { calcFreightDesc, calcPrices, getImageMainPath, getImagePath, popNewMessage, priceFormat } from '../../utils/tools';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    goods:GoodsDetails;     // 商品详情
    skuId?:string;
}
/**
 * 商品详情
 */
export class GoodsDetailHome extends Widget {
    public setProps(props:Props,oldProps:Props) {
        const obj = calcFreightDesc(getStore('mall/freights'));
        const goodsItemDescs = {
            freight:{ 
                title:'运费说明',
                itemContent:obj.freightInterval,
                descs:[
                    { title:'运费说明',content:obj.freightDesc }
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
        const ret = calcPrices(props.goods);
        const skus = props.goods.labels;
        const skuIndex = -1;
        // if (skus.length === 1) skuIndex = 0;  // 单规格商品选中规格
        const cartGoods = getStore('mall/cartGoods');
        let len = 0;
        for (const v of cartGoods) {
            len += v.amount;
        }
        this.props = {
            ...props,
            ...ret,
            mallImagPre,
            goodsItemDescs,
            cartGoodsLen:len,
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
            if (this.props.skuId) {
                for (let i = 0;i < goods.labels.length;i++) {
                    const sku = goods.labels[i];
                    if (sku[0] === this.props.skuId) {
                        this.props.skuIndex = i;
                        break;
                    }
                }
            }
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
        if (key === 'verified') {
            if (getStore('user/IDCard')) {
                popNew('app-view-mine-verify');
            } else {
                popNew('app-view-mine-IDCardUpload');
            }
        } else {
            this.props.descProps = this.props.goodsItemDescs[key];
        }
        
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
        this.props.chooseSpec = true;
        this.paint();
    }

    // 选择规则
    public chooseSpecClick1(buyNow:boolean) {
        this.props.buyNow = buyNow;
        const skus = this.props.goods.labels;
        // if (skus.length === 1) {
        //     this.sureClick({ buyNow });
        // } else {
        this.props.chooseSpec = true;
        this.paint();
        // }
    }

    // 选择规则关闭
    public specCloseClick(res:any) {
        if (res.amount >= 1 && res.skuIndex >= 0) {
            this.props.skuIndex = res.skuIndex;
            this.props.amount = res.amount;
        } 
        this.props.chooseSpec = false;
        this.paint();
    }
    
    // 立即购买
    public sureClick(res:any) {
        const sku = this.props.goods.labels[this.props.skuIndex];
        if (sku[3] === 0) {
            popNewMessage('库存不足');

            return;
        }
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

            popNew('app-view-shoppingCart-confirmOrder',{ orderGoods:cartGoods,buyNow:true,totalAmount:this.props.amount });
        } else {
            const goodId = this.props.goods.id;
            const num = calcCartGoodsNum(goodId,sku[0]);
            if (num + this.props.amount > sku[3]) {
                popNewMessage('库存不足(含已加购物车件数)'); 
                
                return;
            }
            addCart(goodId,this.props.amount,sku[0]).then(() => {
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

    public updateCartGoodsIcon(cartGoods:CartGoods[]) {
        let len = 0;
        for (const v of cartGoods) {
            len += v.amount;
        }
        this.props.cartGoodsLen = len;
        this.paint();
    }
}

// 计算加入购物车的商品数量
const calcCartGoodsNum = (goodId:number,skuId:string) => {
    const cartGoods = getStore('mall/cartGoods');
    for (const cart of cartGoods) {
        const goods = cart.goods;
        const sku = goods.labels;
        if (goods.id === goodId && sku[0][0] === skuId) return cart.amount;
    }

    return 0;
};

// 购物车变动
register('mall/cartGoods',(cartGoods:CartGoods[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateCartGoodsIcon(cartGoods);
});