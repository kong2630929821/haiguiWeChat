import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, randomInviteCode, sendCode, verifyIDCard } from '../../net/pull';
import { getStore, setStore } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';
import { popNewLoading, popNewMessage } from '../../utils/tools';

interface Props {
    realName:string;  // 用户名
    userName:string;  // 用户名
    selectAddr:boolean;  // 是否显示地区选择
    phoneNum:string;  // 手机号
    address:any;  // 地址 Address
    nowCount:number;  // 倒计时
    phoneCode:string;  // 手机验证码
    inviteCode:string;  // 邀请码
    fcode:string;  // 已绑过的邀请码
}
/**
 * 填信息输入框弹窗
 */
export class ModalBoxInput extends Widget {
    public ok:(addr:any) => void;  // 地址信息
    public cancel:() => void;
    public props:Props = {
        realName:'',
        userName:'',
        selectAddr:false,
        phoneNum:'',
        address:{},
        nowCount:0,
        phoneCode:'',
        inviteCode:'',
        fcode:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const user = getStore('user');
        this.props.realName = user.realName;
        this.props.userName = user.realName;
        this.props.phoneNum = user.phoneNum;
        this.props.fcode = user.fcode;
        this.props.inviteCode = user.fcode;
        this.props.address = getLastAddress()[2];
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
        randomInviteCode().then(r => {
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
        if (!this.props.userName || !this.props.phoneNum || !this.props.phoneCode || !this.props.inviteCode || (this.props.selectAddr && !this.props.address)) {
            popNewMessage('请将内容填写完整');
        } else {
            const loadding = popNewLoading('请稍后');

            try {  // 验证手机号
                if (this.props.phoneNum !== getStore('user/phoneNum')) {
                    const phoneRes = await bindPhone(this.props.phoneNum,this.props.phoneCode);
                    if (phoneRes) setStore('user/phoneNum',this.props.phoneNum);
                } 
            } catch (err) {
                loadding.callback(loadding.widget);
                if (err.result === 1023) {
                    popNewMessage('手机号已被注册');
                } else {
                    popNewMessage('验证码填写有误');
                }

                return;
            }

            try {   // 设置用户名
                if (this.props.realName) {
                    const nameRes = await verifyIDCard(this.props.userName,'','','','');
                    if (nameRes) setStore('user/realName',this.props.userName);
                }  
            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('用户名设置失败');

                return;
            }

            try {   // 绑定邀请码
                if (!getStore('user/fcode','')) await bindUser(this.props.inviteCode);

            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('邀请码填写有误');

                return;
            }
            
            loadding.callback(loadding.widget);
            this.ok && this.ok(this.props.address);  // 所有接口都请求成功后关闭弹窗
        }
    }

    public selAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(index:number) => {
            this.props.address = getStore('mall/addresses')[index];
            this.paint();
        });
    }

}