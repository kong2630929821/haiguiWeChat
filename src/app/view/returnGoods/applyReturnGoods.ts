import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { returnGoods, uploadFileApp } from '../../net/pull';
import { Order } from '../../store/memstore';
import { selectImage } from '../../utils/native';
import { popNewMessage } from '../../utils/tools';
import { takeImage, upImage } from '../../utils/wxAPI';

interface Props {
    order:Order;  // 订单详情
    reason:string;   // 退货原因
    imgs:string[];  // 凭证图片
    describle:string;  // 退款描述
    returnId:number;   // 售后单号id
    isUpload:boolean;   // 是否正在上传图片
}
/**
 * 申请退货填写理由
 */
export class ApplyReturnGoods extends Widget {
    public ok:() => void;
    public props:Props = {
        imgs:[],
        reason:'',
        describle:'',
        returnId:0,
        order:null,
        isUpload:false
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
        if (this.props.isUpload) {
            popNewMessage('正在上传，请稍等');
        }

        const flag = window.sessionStorage.appInflag;
        if (flag) {    // app进入，唤起手机相机
            const imagePicker = selectImage((width, height, url) => {
                console.log('selectImage url = ',url);

            // 预览图片
                imagePicker.getContent({
                    quality:70,
                    success(buffer:ArrayBuffer) {
                        this.props.imgs.push(url);
                        this.paint();

                        // 上传图片
                        uploadFileApp(buffer).then((res) => {
                            popNewMessage('图片上传成功');
                            console.log('图片上传成功',res);
                            this.props.imgs.pop();
                            this.props.imgs.push(serverFilePath + res);
                            this.paint();
                        });
                    }
                });

            });

        } else {    // 公众号进入，用微信相机
            takeImage(1,(r) => {
                console.log(r);
                this.props.imgs.push(r);
                upImage(r, res => {
                    popNewMessage('图片上传成功');
                    console.log('图片上传成功',res);
                    this.props.imgs.pop();
                    this.props.imgs.push(serverFilePath + res);
                    this.paint();
                });

                this.paint();
            });
        }
    }

    // 删除图片
    public delImg(i:number) {
        this.props.imgs.splice(i,1);
        this.paint();
    }

    // 选择退货理由
    // public selectReason() {
    //     popNew('app-components-selectList-reasonSelectList',{ selected:-1,list:['原因一','原因二','原因三'] },(r => {
    //         this.props.reason = r.value;
    //         this.paint();
    //     }));
    // }

    public descChange(e:any) {
        this.props.describle = e.value;
        this.paint();
    }

    // 确认提交退货申请
    public confirm() {
        if (!this.props.describle) {
            popNewMessage('请输入退货原因');

            return;
        }
        if (this.props.imgs.length === 0) {
            popNewMessage('请至少上传一张图片');

            return;
        }
        if (this.props.isUpload) {
            popNewMessage('图片正在上传中，请稍等');
           
            return;
        }

        returnGoods(this.props.returnId, this.props.describle, this.props.imgs).then(() => {
            popNewMessage('申请退货成功');
            this.ok && this.ok();
        }).catch(() => {
            popNewMessage('申请退货失败');
        });
    }
}