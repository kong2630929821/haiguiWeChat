import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { verifyIDCard } from '../../net/pull';
import { selectImg } from '../../utils/logic';
import { popNewMessage } from '../../utils/tools';
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
                // this.uploadImg(num);
            });
        } else {
            // this.uploadImg(num);
        }
    }

    // 选择图片
    public uploadImg(num:number) {
        selectImg(1,(r) => {
            console.log(r);
            if (num === 1) {
                this.props.img1 = r[0];
            } else {
                this.props.img2 = r[0];
            }
            this.paint();
        });
    }

    public verifyImg() {
        if (this.props.img1 && this.props.img2) {
            verifyIDCard(this.props.img1).then(r => {
                popNew('app-view-mine-verified',{});
            });
            
        } else {
            popNewMessage('请先上传图片');
        }
    }
}