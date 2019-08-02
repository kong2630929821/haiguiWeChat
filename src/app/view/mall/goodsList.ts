import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { mallImagPre } from '../../config';
import { getGoodsInfo } from '../../net/pull';
import { getStore, GoodsDetails, Groups, GroupsLocation } from '../../store/memstore';
import { getImageMainPath } from '../../utils/tools';

export const forelet = new Forelet();

interface Props {
    styleMod:StyleMod;                    // 样式
    selectedLevel1Groups:Groups;   // 选中的一级分组
    selectedLevel2Groups:Groups | GoodsDetails;   // 选中的二级分组
    classificationGroups:Groups[]; // 分类页一级分组
    level1GroupsExpanded:boolean;  // 是否展开一级分组下拉页
    getImageMainPath:any;   // 获取图片路径
    mallImagPre:string;    // 商城图片前路径
    goodsList:GoodsDetails[];   // 商品列表
    refresh:boolean;   // 是否正在刷新
    active:number;     // 当前选则的排序规则
    sortType:number;   // 排序规则 0 价格  1 销量
    sortRule:[boolean,boolean];   // 排序规则 从大到小
}

export enum StyleMod {     // 样式
    ONE = 1,
    TWO = 2
}
/**
 * 商品列表页
 */
export class GoodsList extends Widget {
    public props:Props = {
        styleMod:StyleMod.ONE,
        selectedLevel1Groups:null,
        selectedLevel2Groups:null,
        classificationGroups:getStore('mall/groups').get(GroupsLocation.CLASSIFICATION),    // 分类页一级分组
        level1GroupsExpanded:false,   // 是否展开一级分组下拉页
        getImageMainPath,
        mallImagPre,
        goodsList:[],
        refresh:false,  
        active:0,
        sortType:-1,       // 排序规则 价格
        sortRule:[false,false]     // 排序规则 从大到小
    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        console.log('GoodsList ====',this.props);
        getGoodsInfo(props.selectedLevel2Groups.id,0).then((goods:GoodsDetails[]) => {
            this.props.goodsList = goods;
            this.paint();
            // this.changeSortRule(this.props.sortType, this.props.sortRule[this.props.sortType]);
        });
    }

    public attach() {
        super.attach();
        const viewPortWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const activeDom:HTMLElement = document.querySelector('.groups2-item-active');
        const rect = activeDom.getBoundingClientRect();
        const offsetLeft = activeDom.offsetLeft;
        const overFlowWidth = offsetLeft + rect.width - viewPortWidth;
        if (overFlowWidth > 0) {   // 元素不在可视范围内
            const groups2Dom = document.querySelector('.groups2');
            groups2Dom.scrollLeft = overFlowWidth;
        }
    }
    
    // 一级分组页切换
    public level1GroupsExpandedClick() {
        this.props.level1GroupsExpanded = !this.props.level1GroupsExpanded;
        this.paint();
    }

    // 选择一级分组
    public selectLevel1Groups(e:any,index:number) {
        const selectedLevel1Groups = this.props.classificationGroups[index];
        this.props.selectedLevel1Groups = selectedLevel1Groups;
        this.props.selectedLevel2Groups = selectedLevel1Groups.childs[0];
        this.props.level1GroupsExpanded = false;
        this.props.goodsList = [];
        getGoodsInfo(this.props.selectedLevel2Groups.id,0).then((goods:GoodsDetails[]) => {
            this.props.goodsList = goods;
            this.changeSortRule(this.props.sortType, this.props.sortRule[this.props.sortType]);
        });
        this.paint();
    }

    // 选择二级分组
    public selectLevel2Groups(e:any,index:number) {
        this.props.selectedLevel2Groups = this.props.selectedLevel1Groups.childs[index];
        // this.props.goodsList = [];
        getGoodsInfo(this.props.selectedLevel2Groups.id,0).then((goods:GoodsDetails[]) => {
            this.props.goodsList = goods;
            this.changeSortRule(this.props.sortType, this.props.sortRule[this.props.sortType]);            
        });
        this.paint();
    }

    // 点击商品
    public goodsItemClick(e:any,index:number) {
        popNew('app-view-mall-goodsDetail',{ goods:this.props.goodsList[index] });
    }

    // 关闭一级分类
    public closeClick() {
        this.props.level1GroupsExpanded = false;
        this.paint();
    }

    /**
     * 页面滑动，加载更多数据
     */
    // public getMoreList() {
        // if (this.props.refresh) return;
        // const oh1 = document.getElementById('good-list').offsetHeight;
        // const oh2 = document.getElementById('good-list-items').offsetHeight;
        // const scrollTop = document.getElementById('good-list').scrollTop; 
        // if (oh2 - oh1 - scrollTop < -38) {
        //     this.props.refresh = true;
        //     getGoodsInfo(this.props.selectedLevel2Groups.id,this.props.goodsList[this.props.goodsList.length - 1].id).then((goods:GoodsDetails[]) => {
        //         this.props.refresh = false;
        //         this.props.goodsList = this.props.goodsList.concat(goods);
        //         this.paint();
        //     });
        // } 
        // this.paint();
    // }
    
    /**
     * 改变排序规则 
     * @param ind type
     * @param fg 明确要使用的排序规则
     */
    public changeSortRule(ind:number,fg?:boolean) {
        this.props.sortType = ind;
        const rule = fg !== undefined ? fg :!this.props.sortRule[ind];

        if (ind === 0) {
            this.props.goodsList.sort(rule ? sortCmd1 :sortCmd2);
        } else {
            this.props.goodsList.sort(rule ? sortCmd3 :sortCmd4);
        }
        this.props.sortRule[ind] = rule;
        this.paint();
        console.log('!!!!!!!!!!!!!!!!!!changeSortRule', this.props.goodsList);
    }
}

// 销量从大到小排序
export const sortCmd1 = (v1:GoodsDetails,v2:GoodsDetails) => {
    // return v2.saleCount - v1.saleCount || v1.id - v2.id;
    return v2.saleCount - v1.saleCount;
};

// 销量从小到大排序
export const sortCmd2 = (v1:GoodsDetails,v2:GoodsDetails) => {
    // return v1.saleCount - v2.saleCount || v1.id - v2.id;
    return v1.saleCount - v2.saleCount;
};

// 价格从大到小排序
export const sortCmd3 = (v1:GoodsDetails,v2:GoodsDetails) => {
    // return v2.discount - v1.discount || v1.id - v2.id;
    return v2.discount - v1.discount;
};

// 价格从小到大排序
export const sortCmd4 = (v1:GoodsDetails,v2:GoodsDetails) => {
    // return v1.discount - v2.discount || v1.id - v2.id;
    return v1.discount - v2.discount;
};