
// ================================ 导入
import { backList } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { CartGoods, register } from '../../store/memstore';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

/**
 * 首页
 */
export class App extends Widget {

    public props:any;
    public old: any = {};
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        this.props = {
            type: 2, // 用户可以单击选项，来切换卡片。支持3种模式，惰性加载0-隐藏显示切换，切换采用加载1-销毁模式，一次性加载2-隐藏显示切换。
            isActive:0,
            old: this.old,
            tabBarList: [
                {
                    text: '商城',
                    icon: 'mall1.png',
                    iconActive: 'mall_active1.png',
                    components: 'app-view-mall-home-home'
                },
                {
                    text: '分类',
                    icon: 'classify1.png',
                    iconActive: 'classify_active1.png',
                    components: 'app-view-mall-home-groupsHome'
                },{
                    text: '购物车',
                    icon: 'shoppingCart1.png',
                    iconActive: 'shoppingCart_active1.png',
                    components: 'app-view-shoppingCart-home-home'
                },{
                    modulName: 'APP_EARN',
                    text: '会员',
                    icon: 'income1.png',
                    iconActive: 'income_active1.png',
                    components: 'app-view-member-home-home'
                },{
                    text: '我的',
                    icon: 'mine1.png',
                    iconActive: 'mine_active1.png',
                    components: 'app-view-mine-home-home'
                }
            ],
            tabBarAnimateClasss:'',
            cartGoodsLen:0
        };
        
    }

    public tabBarChangeListener(event: any, index: number) {
        console.log('tabBarChangeListener！！！！！！！！！！！！！！！！！');
        if (this.props.isActive === index) return;
        this.props.isActive = index;
        this.old[index] = true;
        this.paint();
    }

    // 前往商城首页
    public gotoMallHome() {
        this.props.isActive = 0;
        closeAllPage();
        this.paint();
    }

    // 前往购物车
    public gotoShoppinigCart() {
        this.props.isActive = 2;
        closeAllPage();
        this.paint();
    }

    // 前往分类页
    public gotoClass() {
        this.props.isActive = 1;
        closeAllPage();
        this.paint();
    }

    // 去我的
    public gotoMine() {
        this.props.isActive = 4;
        closeAllPage();
        this.paint();
    }

    // 去会员页
    public gotoMember() {
        this.props.isActive = 3;
        closeAllPage();
        this.paint();
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

// ===================================================== 本地
const closeAllPage = () => {
    const len = backList.length;
    for (let i = len - 1;i > 0;i--) {
        const w = backList[i];
        w.callback(w.widget);
    }
};

// ===================================================== 立即执行
// 去商城
register('flags/gotoMallHome',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.gotoMallHome();
});

// 去购物车
register('flags/gotoShoppinigCart',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.gotoShoppinigCart();
});

// 去分类
register('flags/gotoClass',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.gotoClass();
});

// 去我的
register('flags/gotoMine',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.gotoMine();
});

// 去升级会员
register('flags/gotoMember',() => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.gotoMember();
});

// 购物车变动
register('mall/cartGoods',(cartGoods:CartGoods[]) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateCartGoodsIcon(cartGoods);
});