import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { returnGoods } from '../../net/pull';
import { Order } from '../../store/memstore';
import { popNewMessage } from '../../utils/tools';
import { takeImage, upImage } from '../../utils/wxAPI';

interface Props {
    order:Order;
    reason:string;   // 退货原因
    imgs:string[];
    describle:string;  // 退款描述
}
/**
 * 申请退货填写理由
 */
export class ApplyReturnGoods extends Widget {
    public ok:() => void;
    public props:Props = {
        order:{
            id:12545125,
            orderGoods:[
                [
                    {
                        name:'hhhhhhhhhhh',   // 商品名称
                        labels:[['123242','hhhhhhhh',0,1]],	 // SKU SKU描述 价格影响 库存
                        images:[{
                            path:'',  // 图片url
                            type:0,  // 图片的类型，例如图标、小图、大图等
                            style:0
                        }],
                        freight:0,
                        tax:0,
                        origin:0 
                    },1,1
                ]
            ]
        },
        imgs:[],
        reason:'',
        describle:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }

    // 选择图片
    public chooseImg() {
        takeImage(1,(r) => {
            console.log(r);
            this.props.imgs.push(r);
            upImage(r, res => {
                popNewMessage('图片上传成功');
                console.log('图片上传成功',res);
                this.props.imgs.push(serverFilePath + res);
                this.paint();
            });

            this.paint();
        });
    }

    // 删除图片
    public delImg(i:number) {
        this.props.imgs.splice(i,1);
        this.paint();
    }

    // 选择退货理由
    public selectReason() {
        popNew('app-components-selectList-reasonSelectList',{ selected:-1,list:['原因一','原因二','原因三'] },(r => {
            this.props.reason = r.value;
            this.paint();
        }));
    }

    public descChange(e:any) {
        this.props.describle = e.value;
        this.paint();
    }

    // 确认提交退货申请
    public confirm() {
        if (!this.props.reason) {
            popNewMessage('请选择退货原因');

            return;
        }
        const res = `${this.props.reason}: ${this.props.describle}`;
        returnGoods(this.props.order.id, res, this.props.imgs).then(() => {
            popNewMessage('申请退货成功');
            this.ok && this.ok();
        }).catch(() => {
            popNewMessage('申请退货失败');
        });
    }
}