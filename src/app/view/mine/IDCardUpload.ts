import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { popNewMessage } from '../../utils/tools';
import { takeImage, upImage } from '../../utils/wxAPI';
interface Props {
    firstClick:boolean; // 是否是第一次点击上传按钮
    img1:string;
    img2:string;
    front:string; // 身份证正面照ID
    back:string;  // 身份证正面照ID
}
/**
 * 上传身份证
 */
export class IDCardUpload extends Widget {
    public ok:() => void;
    public props:Props = {
        firstClick:true,
        img1:'',
        img2:'',
        front:'',
        back:''
    };
    
    // 点击上传按钮
    public uploadBtn(num:number) {
        if (this.props.firstClick) {
            this.props.firstClick = false;
            this.paint();
            popNew('app-components-modalBox-modalBoxImg',null,() => {
                this.chooseImg(num);
            });
        } else {
            this.chooseImg(num);
        }
    }

    // 选择图片
    public chooseImg(num:number) {
        takeImage(1,(r) => {
            console.log(r);
            if (num === 1) {
                this.props.img1 = r;
                upImage(r, res => {
                    popNewMessage('图片上传成功');
                    this.props.img1 = serverFilePath + res;
                    this.props.front = res;
                    this.paint();
                });

            } else {
                this.props.img2 = r;
                upImage(r, res => {
                    popNewMessage('图片上传成功');
                    this.props.img2 = serverFilePath + res;
                    this.props.back = res;
                    this.paint();
                });
            }
            this.paint();
        });
    }

    public verifyImg() {
        if (this.props.front && this.props.back) {
            popNew('app-view-mine-verified',{
                front: this.props.front,
                back:this.props.back
            },(fg) => {
                if (fg) {
                    this.ok && this.ok();
                }
            });
            
        } else {
            popNewMessage('请先上传图片');
        }
    }
}