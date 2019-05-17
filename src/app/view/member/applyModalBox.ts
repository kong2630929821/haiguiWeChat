import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, randomInviteCode, sendCode, setUserName } from '../../net/pull';
import { getStore, setStore } from '../../store/memstore';
import { getLastAddress } from '../../utils/logic';
import { popNewLoading, popNewMessage } from '../../utils/tools';

interface Props {
    userName:string;  // 用户名
    selectAddr:boolean;  // 是否显示地区选择
    phoneNum:string;  // 手机号
    address:string;  // 地址
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
        address:'',
        nowCount:0,
        phoneCode:'',
        inviteCode:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const user = getStore('user');
        this.props.userName = user.userName;
        this.props.phoneNum = user.phoneNum;
        this.props.inviteCode = user.fcode || 'WSGHJA';
        const addr = getLastAddress()[2];
        this.props.address = addr ? addr.address :'详细地址信息';
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
        if (!this.props.userName || !this.props.phoneNum || !this.props.phoneCode || !this.props.inviteCode) {
            popNewMessage('请将内容填写完整');
        } else {
            const loadding = popNewLoading('请稍后');

            try {  // 验证手机号
                const phoneRes = await bindPhone(this.props.phoneNum,this.props.phoneCode);
                if (phoneRes) setStore('user/phoneNum',this.props.phoneNum);

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
                const nameRes = await setUserName(this.props.userName);
                if (nameRes) setStore('user/userName',this.props.userName);
            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('用户名设置失败');

                return;
            }

            try {   // 绑定邀请码
                await bindUser(this.props.inviteCode);
            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('邀请码填写有误');

                return;
            }
            
            loadding.callback(loadding.widget);
            this.ok && this.ok();  // 所有接口都请求成功后关闭弹窗
        }
    }

    public selAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(index:number) => {
            const addr = getStore('mall/addresses')[index];
            this.props.address = addr ? addr.address :'详细地址信息';
            this.paint();
        });
    }

}