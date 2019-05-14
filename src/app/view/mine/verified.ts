import { Widget } from '../../../pi/widget/widget';
interface Props {
    firstClick:boolean; // 是否是第一次点击上传按钮
}
/**
 * 实名认证
 */
export class Verified extends Widget {
    public props:Props = {
        firstClick:true
    };
    
}