import { Widget } from '../../../pi/widget/widget';

interface Props {
    img: string;  // 图片
    originalImg:string; // 原图
    showOrg:boolean; // 是否显示原图
}
/**
 * 大图 全屏图
 */
export class BigImage extends Widget {
    public props: Props;
    public ok: () => void;

    public closePage() {
        this.ok && this.ok();
    }

    // 查看原图
    public showOriginal() {
        this.props.showOrg = true;
        this.paint();
    }

}
