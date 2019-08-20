import { Widget } from '../../../pi/widget/widget';
interface Props {
    img:string;
    btn:boolean;
}
/**
 * 上传身份证照片示例
 */
export class IDCardUpload extends Widget {
    public ok:() => void;
    public props:Props = {
        img:'uploadIDCard1.png',
        btn:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
    public close() {
        this.ok && this.ok();
    }
}
