import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, randomInviteCode, sendCode, verifyIDCard } from '../../net/pull';
import { getStore, setStore, UserType } from '../../store/memstore';
import { judgeRealName } from '../../utils/logic';
import { checkPhone, popNewLoading, popNewMessage } from '../../utils/tools';
import { localInviteCode } from '../base/main';

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
    userType:UserType;  // 用户会员等级
    unaccalimed:boolean;// 开通未领取礼包
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
        changePhone:true,
        userType:UserType.hBao,
        unaccalimed:false
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
            this.props.fcode = user.hwcode;
            console.log('用户信息！！！！',user,`this.props.fcode-------${this.props.fcode}`);
        }
        if (props.userType === UserType.hWang) {
            this.props.needSelGift = false;
        }
        this.props.inviteCode = localInviteCode || user.fcode;  // 分享人的邀请码
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
        if (!checkPhone(this.props.phoneNum)) {
            popNewMessage('手机号格式错误');
        } else {
            sendCode(this.props.phoneNum).then(r => {
                popNewMessage('验证码已发送');
            }).catch(err => {
                popNewMessage('获取验证码失败');
            });

            // 60秒只能点一次，无论返回成功与否
            this.props.nowCount = 60;
            this.paint();
            const countdown = setInterval(() => {
                this.props.nowCount--;
                if (this.props.nowCount === 0) {
                    clearInterval(countdown);
                }
                this.paint();
            },1000);
        }
    }

    // 获取邀请码
    public getInvoteCode() {
        const t = this.props.userType === UserType.hWang ? 1 :3;
        randomInviteCode(t).then(r => {  // 升级海王只能获取海王邀请码
            this.props.inviteCode = r.code;
            this.paint();
        });
    }

    // 切换礼包选择
    public changeSel(sel:string) {
        popNew('app-view-member-giftAB',{ giftType:sel });
        this.props.selected = sel;
        this.paint();
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }

    // 确认
    // tslint:disable-next-line:cyclomatic-complexity
    public async confirm() {
        if (this.props.unaccalimed) {
            console.log(`123`);
            this.ok && this.ok(this.props.selected); 

            return;
        }

        if (!this.props.userName || !this.props.phoneNum || (!this.props.phoneCode && this.props.changePhone) || !this.props.inviteCode) {
            popNewMessage('请将内容填写完整');
        } else if (!judgeRealName(this.props.userName)) {
            popNewMessage('请输入真实姓名');
            
        } else {
            const loadding = popNewLoading('请稍后');

            try {  // 验证手机号 修改过需要重新验证
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

            try {   // 绑定邀请码 非会员用户
                if (!this.props.fcode) {
                    const t = this.props.userType === UserType.hWang ? 1 :3;
                    const code = await bindUser(this.props.inviteCode,t);
                    if (code) setStore('user/fcode',this.props.inviteCode);
                }

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