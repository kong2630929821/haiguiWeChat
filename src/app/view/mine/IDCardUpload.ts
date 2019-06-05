import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { serverFilePath } from '../../config';
import { identifyIDCard, verifyIDCard } from '../../net/pull';
import { setStore } from '../../store/memstore';
import { popNewLoading, popNewMessage } from '../../utils/tools';
import { setWxConfig, takeImage, upImage } from '../../utils/wxAPI';
interface Props {
    img1:string;
    img2:string;
    front:string; // 身份证正面照ID
    back:string;  // 身份证正面照ID
    name:string;  // 姓名
    card:string;  // 身份证号
    validDate:string;  // 身份证有效期
}
/**
 * 上传身份证
 */
export class IDCardUpload extends Widget {
    public ok:() => void;
    public props:Props = {
        img1:'',
        img2:'',
        front:'',
        back:'',
        name:'',
        card:'',
        validDate:''
    };

    public create() {
        super.create();
        setWxConfig();
    }
    
    public nameChange(e:any) {
        this.props.name = e.value;
    }

    public cardChange(e:any) {
        this.props.card = e.value;
    }

    // 点击上传按钮
    public uploadBtn(num:number) {
        popNew('app-components-modalBox-modalBoxImg',{ img: num === 1 ? 'uploadIDCard1.png' :'uploadIDCard2.png' },() => {
            this.chooseImg(num);
        });
        
    }

    // 选择图片
    public chooseImg(num:number) {
        takeImage(1,(r) => {
            console.log(r);
            if (num === 1) {
                this.props.img1 = r;
                upImage(r, res => {
                    popNewMessage('图片上传成功');
                    console.log('图片上传成功',res);
                    this.props.img1 = serverFilePath + res;
                    this.props.front = res;
                    this.paint();
                });

            } else {
                this.props.img2 = r;
                upImage(r, res => {
                    popNewMessage('图片上传成功');
                    console.log('图片上传成功',res);
                    this.props.img2 = serverFilePath + res;
                    this.props.back = res;
                    this.paint();
                });
            }
            this.paint();
        });
    }

    // 删除图片
    public delImg(num:number) {
        if (num === 1) {
            this.props.img1 = '';
            this.props.front = '';
        } else {
            this.props.img2 = '';
            this.props.back = '';
        }
        this.paint();
    }

    // 实名认证
    public verify() {
       
        if (this.props.front && this.props.back && this.props.name && this.props.card) {
            const loadding = popNewLoading('身份认证中');
            // 识别正面照
            identifyIDCard(serverFilePath + this.props.front).then(res => {
                console.log(res.body);
                const data = JSON.parse(res.body);
                if (this.props.name !== data.name || this.props.card !== data.id) {
                    popNewMessage('实名认证失败，请认真核对信息');
                    loadding && loadding.callback(loadding.widget);

                    return;
                }

                // 识别背面照
                identifyIDCard(serverFilePath + this.props.back).then(res => {
                    loadding && loadding.callback(loadding.widget);
                    console.log(res.body);
                    const data = JSON.parse(res.body);
                    this.props.validDate = data.valid_date;

                    // 上传身份信息
                    verifyIDCard(this.props.name,this.props.card,this.props.front,this.props.back,this.props.validDate).then(() => {
                        loadding && loadding.callback(loadding.widget);
                        this.ok && this.ok();
                        popNewMessage('实名认证成功');
                        setStore('user/realName',this.props.name,false);
                        setStore('user/IDCard',this.props.card,false);
                    }).catch(() => {
                        popNewMessage('实名认证失败，请认真核对信息');
                        loadding && loadding.callback(loadding.widget);
                    });
                });
            });
            
        } else {
            popNewMessage('请将信息填写完整');
        }
    }
}