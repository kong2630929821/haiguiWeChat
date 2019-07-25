import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { parseGoodsDetail } from '../../net/parse';
import { searchGoodsByName } from '../../net/pull';
import { GoodsDetails } from '../../store/memstore';
import { popNewMessage } from '../../utils/tools';
import { sortCmd1, sortCmd2, sortCmd3, sortCmd4 } from './goodsList';
interface Props {
    goodsList:GoodsDetails[];  // 商品列表
    message:string;  // 输入的内容
    sortType:number;   // 排序规则 0 价格  1 销量
    sortRule:[boolean,boolean];   // 排序规则 从大到小
}
/**
 * 搜索商品
 */
export class SearchGoods extends Widget {
    public props:Props = {
        goodsList:[],
        message:'',
        sortType:0,       // 排序规则 价格
        sortRule:[true,false]     // 排序规则 从大到小
    };

    // 输入
    public messChange(e:any) {
        this.props.message = e.value;
        this.paint();
    }

    // 搜索
    public search() {
        if (!this.props.message) {
            popNewMessage('请输入搜索条件');

            return;
        }
        searchGoodsByName(this.props.message).then(r => {
            const goods:GoodsDetails[] = [];
            for (const v of r.goodsInfo) {
                const good = parseGoodsDetail(v);
                goods.push(good);
            }
            this.props.goodsList = goods;
            this.paint();
            console.log(this.props.message,goods);
        });
    }
    
    // 点击商品
    public goodsItemClick(index:number) {
        popNew('app-view-mall-goodsDetail',{ goods:this.props.goodsList[index] });
    }

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
        console.log('!!!!!!!!!!!!!!!!!!changeSortRule',ind,this.props.goodsList);
    }

    public keydown(e:any) {
        if (e.value === 'Enter') {
            this.search();
        }
    }
}