import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { verifyIDCard } from '../../net/pull';
import { popNewMessage } from '../../utils/tools';
import { takeImage, upImage } from '../../utils/wxAPI';
interface Props {
    firstClick:boolean; // 是否是第一次点击上传按钮
    img1:string;
    img2:string;
}
/**
 * 上传身份证
 */
export class IDCardUpload extends Widget {
    public props:Props = {
        firstClick:true,
        img1:'',
        img2:''
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
                upImage(r,res => {
                    this.props.img1 = serverFilePath + res;
                    this.paint();
                });

            } else {
                this.props.img2 = r;
                upImage(r,res => {
                    this.props.img2 = serverFilePath + res;
                    this.paint();
                });
            }
            this.paint();
        });
    }

    public verifyImg() {
        if (this.props.img1 && this.props.img2) {
            popNew('app-view-mine-verified',{});
            
        } else {
            popNewMessage('请先上传图片');
        }
    }
}