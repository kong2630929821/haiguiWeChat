import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, randomInviteCode, sendCode, verifyIDCard } from '../../net/pull';
import { getStore, setStore, UserType } from '../../store/memstore';
import { popNewLoading, popNewMessage } from '../../utils/tools';

interface Props {
    title?:string;   // 标题
    realName:string;  // 用户名
    userName:string;  // 用户名
    phoneNum:string;  // 手机号
    nowCount:number;  // 倒计时
    phoneCode:string;  // 手机验证码
    inviteCode:string;  // 邀请码
    fcode:string;  // 已绑过的邀请码 只有海宝升级海王时不能修改
    selected:string; // 选择的礼包
    needSelGift:boolean; // 是否需要选择礼包
    changePhone:boolean; // 是否修改手机号
}
/**
 * 填信息输入框弹窗
 */
export class ModalBoxInput extends Widget {
    public ok:(select:string) => void;  // 地址信息
    public cancel:() => void;
    public props:Props = {
        realName:'',
        userName:'',
        phoneNum:'',
        nowCount:0,
        phoneCode:'',
        inviteCode:'',
        fcode:'',
        selected:'A',
        needSelGift:true,
        changePhone:true
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const user = getStore('user');
        if (user.IDCard) {// 有身份证号，表示实名认证成功，不允许再修改名字
            this.props.realName = user.realName;
        }
        this.props.userName = user.realName;
        this.props.phoneNum = user.phoneNum;
        this.props.changePhone = !user.phoneNum;  // 已经绑过则默认不修改手机号
        if (user.userType <= UserType.hBao) {// 成为会员后不允许修改父级邀请码
            this.props.fcode = user.fcode;
        }
        this.props.inviteCode = user.fcode;
    }

    // 输入用户名
    public nameChange(e:any) {
        this.props.userName = e.value;
        this.paint();
    }

    // 输入手机号
    public phoneChange(e:any) {
        this.props.phoneNum = e.value;
        this.props.changePhone = e.value !== getStore('user/phoneNum');
        this.paint();
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

    // 切换礼包选择
    public changeSel(sel:string) {
        this.props.selected = sel;
        this.paint();
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }

    // 确认
    public async confirm() {
        if (!this.props.userName || !this.props.phoneNum || (!this.props.phoneCode && this.props.changePhone) || !this.props.inviteCode) {
            popNewMessage('请将内容填写完整');
        } else {
            const loadding = popNewLoading('请稍后');

            try {  // 验证手机号
                if (this.props.changePhone) {
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

            try {   // 设置用户名 实名认证过不允许再修改
                if (!this.props.realName) {
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
            this.ok && this.ok(this.props.selected);  // 所有接口都请求成功后关闭弹窗
        }
    }

}