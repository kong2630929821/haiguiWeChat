import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, getInviteCode, sendCode, setUserName } from '../../net/pull';
import { getStore, setStore } from '../../store/memstore';
import { popNewLoading, popNewMessage } from '../../utils/tools';

interface Props {
    userName:string;  // 用户名
    selectAddr:boolean;  // 是否显示地区选择
    phoneNum:string;  // 手机号
    area:string;  // 地区
    address:string;  // 地址
    areaSelect:any[]; // 地区选择结果
    nowCount:number;  // 倒计时
    phoneCode:string;  // 手机验证码
    inviteCode:string;  // 邀请码
}
/**
 * 填信息输入框弹窗
 */
export class ModalBoxInput extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        userName:'',
        selectAddr:false,
        phoneNum:'',
        area:'',
        address:'',
        areaSelect:[],
        nowCount:0,
        phoneCode:'',
        inviteCode:''
    };

    public create() {
        super.create();
        const user = getStore('user');
        this.props.userName = user.userName;
        this.props.phoneNum = user.phoneNum;
    }

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
       
    }

    // 输入用户名
    public nameChange(e:any) {
        this.props.userName = e.value;
        this.paint();
    }

    // 输入手机号
    public phoneChange(e:any) {
        this.props.phoneNum = e.value;
    }

    // 输入手机验证码
    public phoneCodeChange(e:any) {
        this.props.phoneCode = e.value;
        this.paint();
    }

    // 输入邀请码
    public inviteCodeChange(e:any) {
        this.props.inviteCode = e.value;
        this.paint();
    }

    public addressChange(e:any) {
        this.props.address = e.value;
        this.paint();
    }

    // 获取手机验证码
    public getPhoneCode() {
        if (this.props.phoneNum) {
            sendCode(this.props.phoneNum).then(r => {
                this.props.nowCount = 60;
                popNewMessage('验证码已发送');
                this.paint();
                const countdown = setInterval(() => {
                    this.props.nowCount--;
                    if (this.props.nowCount === 0) {
                        clearInterval(countdown);
                    }
                    this.paint();
                },1000);
            });
        } else {
            popNewMessage('请输入手机号');
        }
    }

    // 获取邀请码
    public getInvoteCode() {
        getInviteCode().then(r => {
            this.props.inviteCode = r.code;
            this.paint();
        });
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }

    // 确认
    public async confirm() {
        if (!this.props.userName || !this.props.phoneNum || !this.props.phoneCode || !this.props.inviteCode) {
            popNewMessage('请将内容填写完整');
        } else {
            const loadding = popNewLoading('请稍后');
            try {
                const phoneRes = await bindPhone(this.props.phoneNum,this.props.phoneCode);
                if (phoneRes && phoneRes.result === 1) setStore('user/phoneNum',this.props.phoneNum);
               
                const nameRes = await setUserName(this.props.userName);
                if (nameRes && nameRes.result === 1) setStore('user/userName',this.props.userName);
                
                await bindUser(this.props.inviteCode);
                loadding.callback(loadding.widget);
                this.ok && this.ok();  // 所有接口都请求成功后关闭弹窗
                 
            } catch (error) {
                loadding.callback(loadding.widget);
                popNewMessage('信息填写有误');
            }
            
        }
    }

    // 选择省 市 区
    public selectArea() {
        popNew('app-components-areaSelect-areaSelect',{ selected:this.props.areaSelect },(r) => {
            if (r && r.length > 0) {
                this.props.areaSelect = r;
                const res = r.map(item => {
                    return item.name;
                });
                this.props.area = res.join('');
                this.paint();
            }
        });
    }
}