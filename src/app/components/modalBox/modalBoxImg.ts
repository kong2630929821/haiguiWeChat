import { Widget } from '../../../pi/widget/widget';

/**
 * 上传身份证照片示例
 */
export class IDCardUpload extends Widget {
    public ok:() => void;

    public close() {
        this.ok && this.ok();
    }
}
