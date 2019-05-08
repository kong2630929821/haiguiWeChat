import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
interface Props {
    list:any[];  // 列表
    selectList:number[];  // 选中下标
    allSelected:boolean;  // 全选
    totalMoney:number;  // 总金额
    editStatus:boolean;  // 编辑状态
    deleteList:number[];  // 要删除的下标
    allDelete:boolean; // 全部删除
}
/**
 * 购物车
 */
export class ShoppingCart extends Widget {
    public props:Props = {
        list:[
            { name:'商品标题商品标题商品标题商品标题商品标题商品标题商品标题',label:'红色，规格1，规格2',num:1,price:88 },
            { name:'商品标题商品标题商品标题商品标题商品标题商品标题商品标题',label:'红色，规格1，规格2',num:1,price:88 },
            { name:'商品标题商品标题商品标题商品标题商品标题商品标题商品标题',label:'红色，规格1，规格2',num:1,price:88 },
            { name:'商品标题商品标题商品标题商品标题商品标题商品标题商品标题',label:'红色，规格1，规格2',num:1,price:88 }
        ],
        selectList:[],
        allSelected:false,
        totalMoney:0,
        editStatus:false,
        deleteList:[],
        allDelete:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 编辑
    public edit() {
        this.props.editStatus = !this.props.editStatus;
        this.props.allDelete = false;
        this.props.deleteList = [];
        this.paint();
    }

    // 选中一项
    public select(num:number) {
        const index = this.props.selectList.indexOf(num);
        const goods = this.props.list[num];
        if (index > -1) {
            this.props.selectList.splice(index,1);
            this.props.totalMoney -= goods.price * goods.num;
        } else {
            this.props.selectList.push(num);
            this.props.totalMoney += goods.price * goods.num;
        }
        this.props.allSelected = this.props.selectList.length === this.props.list.length;
        this.paint();
    }

    // 删除一项
    public delGoods(num:number) {
        const index = this.props.deleteList.indexOf(num);
        if (index > -1) {
            this.props.deleteList.splice(index,1);
        } else {
            this.props.deleteList.push(num);
        }
        this.props.allDelete = this.props.deleteList.length === this.props.list.length;
        this.paint();
    }

    // 全选
    public selectAll() {
        this.props.selectList = [];
        this.props.totalMoney = 0;
        if (!this.props.allSelected) {
            for (let i = 0;i < this.props.list.length;i++) {
                const goods =  this.props.list[i];
                this.props.selectList.push(i);
                this.props.totalMoney += goods.price * goods.num;
            }
        }
        this.props.allSelected = !this.props.allSelected;
        this.paint();
    }

    // 删除全部
    public deleteAll() {
        this.props.deleteList = [];
        if (!this.props.allDelete) {
            for (let i = 0;i < this.props.list.length;i++) {
                this.props.deleteList.push(i);
            }
        }
        this.props.allDelete = !this.props.allDelete;
        this.paint();
    }

    // 减少商品数量
    public delGoodsNum(num:number) {
        if (this.props.list[num].num > 1) {
            this.props.list[num].num--;
            if (this.props.selectList.indexOf(num) > -1) {
                this.props.totalMoney -= this.props.list[num].price;
            }
        } else {
            console.log('不能继续减了');
        }
        this.paint();
    }

    // 增加商品数量
    public addGoodsNum(num:number) {
        this.props.list[num].num++;
        if (this.props.selectList.indexOf(num) > -1) {
            this.props.totalMoney += this.props.list[num].price;
        }
        this.paint();
    }

    // 结算
    public pay() {
        popNew('app-view-shoppingCart-confirmOrder');
        // popNew('app-view-mine-editAddress');
    }
}