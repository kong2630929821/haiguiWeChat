
// ================================ 导入
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';

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
                    icon: 'mall.png',
                    iconActive: 'mall_active.png',
                    components: 'app-view-mall-home-home'
                },
                {
                    text: '分类',
                    icon: 'classify.png',
                    iconActive: 'classify_active.png',
                    components: 'app-view-mall-home-groupsHome'
                },{
                    text: '购物车',
                    icon: 'shoppingCart.png',
                    iconActive: 'shoppingCart_active.png',
                    components: 'app-view-shoppingCart-home-home'
                },{
                    modulName: 'APP_EARN',
                    text: '会员',
                    icon: 'income.png',
                    iconActive: 'income_active.png',
                    components: 'app-view-member-home-home'
                },{
                    text: '我的',
                    icon: 'mine.png',
                    iconActive: 'mine_active.png',
                    components: 'app-view-mine-home-home'
                }
            ],
            tabBarAnimateClasss:''
        };
        
    }

    public tabBarChangeListener(event: any, index: number) {
        if (this.props.isActive === index) return;
        this.props.isActive = index;
        this.old[index] = true;
        this.paint();
    }

}

// ===================================================== 本地

// ===================================================== 立即执行
