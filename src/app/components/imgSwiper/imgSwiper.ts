import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { Swiper } from '../../res/js/swiper.min';
import { Groups } from '../../store/memstore';
import { getImageThumbnailPath } from '../../utils/tools';

interface Props {
    mod:number;                        // 1 首页轮播  2 商品详情轮播
    list:Groups[] | string[];   // image path列表
}
/**
 * 轮播图组件
 */
export class ImgSwiper extends Widget {
    public swiper:any;
    public setProps(props:Props,oldProps:Props) {
        this.props = {
            ...props,
            activeIndex:1,
            getImageThumbnailPath
        };
        super.setProps(this.props,oldProps);
        console.log('ImgSwiper ====',this.props);
    }
    
    public attach() {
        super.attach();
        if (this.swiper || this.props.list.length <= 1) return;
        setTimeout(() => {
            if (this.props.list.length > 1) {
                this.initSwiper();
            }
        },500);
    }

    public afterUpdate() {
        super.afterUpdate();
        if (this.swiper) return;
        setTimeout(() => {
            if (this.props.list.length > 1) {
                this.initSwiper();
            }
        },500);
    }

    // 初始化swiper
    public initSwiper() {
        const $root = getRealNode((<any>this.tree).children[0]);
        this.swiper = new Swiper ($root, {
            loop: true, // 循环模式选项
            observer:true,// 修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,// 修改swiper的父元素时，自动初始化swiper
            autoplay: {
                delay: 2000,
                stopOnLastSlide: false,
                disableOnInteraction: false
            },
            on:{
                slideChangeTransitionStart: (r) => {
                    this.props.activeIndex = this.swiper ? (this.swiper.activeIndex > this.props.list.length ? 1 : this.swiper.activeIndex) : 1; // 切换结束时，告诉我现在是第几个slide
                    this.paint();
                }
            }
        });   
    }
    public clickSlide(e:any) {
        if (this.props.mod === 2) return;
        const group = this.props.list[this.props.activeIndex - 1];
        notify(e.node,'ev-click-slide',{ group });
    }
}