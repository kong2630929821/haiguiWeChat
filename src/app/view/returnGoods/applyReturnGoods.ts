import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { popNewMessage } from '../../utils/tools';
import { takeImage, upImage } from '../../utils/wxAPI';

/**
 * 申请退货填写理由
 */
export class ApplyReturnGoods extends Widget {
    public props:any = {
        order:{
            id:'08098907987987',
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
        status:4,
        imgs:['../../res/image/IDcard1.png']
    };

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
        popNew('app-components-selectList-reasonSelectList',{ selected:-1,list:['原因一','原因二','原因三'] });
    }

    // 确认提交退货申请
    public confirm() {
        // TODO 退货申请
    }
}