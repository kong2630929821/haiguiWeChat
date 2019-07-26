import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { likedGoodsMaxLen, mallImagPre, maxCount } from '../../../config';
import { getGoodsDetails, guessYouLike } from '../../../net/pull';
import { GoodsDetails, Groups, GroupsLocation, register, setStore } from '../../../store/memstore';
import { getImageThumbnailPath } from '../../../utils/tools';
import { StyleMod } from '../goodsList';

export const forelet = new Forelet();

interface Props {
    isActive:boolean;
}

/**
 * 商城首页
 */
export class MallHome extends Widget {
    public state:any;
    public create() {
        super.create();
        this.state = STATE;
    }

    public setProps(props:Props) {
        this.props = {
            ...props,
            GroupsLocation,
            getFixLocationGroup,
            getImageThumbnailPath,
            mallImagPre,
            refresh:false
        };
        super.setProps(this.props);
        setStore('mall/likedGoods',[],false);
        guessYouLike(maxCount);
    }

    // 分组点击
    public groupsClick(res:any) {
        console.log('分组被点击 ====',res.group);
        this.gotoGoodsList(res.group);
    }

    // 固定位置分组点击
    public groupsLocationClick(e:any,location:GroupsLocation) {
        const group = this.state.groups.get(location)[0];
        if (location > GroupsLocation.THIRTEEN) {  // 13以后是四个单链专区位置
            getGoodsDetails(group.childs[0]).then(r => {
                popNew('app-view-mall-goodsDetail',{ goods: r });
            });
        } else {
            this.groupsClick({ group });
        }
    }

    public gotoGoodsList(group:Groups) {
        const selectedLevel1Groups = group;
        const selectedLevel2Groups = selectedLevel1Groups.childs[0];
        popNew('app-view-mall-goodsList',{ selectedLevel1Groups,selectedLevel2Groups,styleMod:StyleMod.ONE });
    }

    /**
     * 页面滑动，加载更多数据
     */
    public getMoreList() {
        if (this.props.refresh) return;
        if (this.state.likedGoods.length >= likedGoodsMaxLen) return;
        const oh1 = document.getElementById('scroll-container').offsetHeight;
        const oh2 = document.getElementById('scroll-content').offsetHeight;
        const scrollTop = document.getElementById('scroll-container').scrollTop; 
        if (oh2 - oh1 - scrollTop < -145) {
            this.props.refresh = true;
            guessYouLike(maxCount).then(() => {
                this.props.refresh = false;
            });
        } 

        this.paint();
    }

    // 商品详情
    public goodsItemClick(e:any,index:number) {
        popNew('app-view-mall-goodsDetail',{ goods:this.state.likedGoods[index] });
    }

    // 去搜索商品
    public goSearch() {
        popNew('app-view-mall-searchGoods');
    }
}

const STATE = {
    groups:new Map<GroupsLocation, Groups[]>(),     // 所有分组信息
    likedGoods:[]                  // 猜你喜欢商品列表
};

/**
 * 获取固定位置的分组
 */
const getFixLocationGroup = (groups:Map<GroupsLocation, Groups[]>,location:GroupsLocation) => {
    const group = groups.get(location);

    return  group ? group[0] : undefined;
};

// 分组信息监听
register('mall/groups',(groups:Map<GroupsLocation, Groups[]>) => {  
    STATE.groups = groups || new Map<GroupsLocation, Groups[]>();
    forelet.paint(STATE);
});

// 分组信息监听
register('mall/likedGoods',(likedGoods:GoodsDetails[]) => { 
    STATE.likedGoods = likedGoods || [];
    forelet.paint(STATE);
});
