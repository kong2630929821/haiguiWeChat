import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { bindPhone, bindUser, randomInviteCode, sendCode, verifyIDCard } from '../../net/pull';
import { getStore, setStore, UserType } from '../../store/memstore';
import { getLastAddress, judgeRealName } from '../../utils/logic';
import { addressFormat, checkPhone, popNewLoading, popNewMessage } from '../../utils/tools';
import { localInviteCode } from '../base/main';
interface Props {
    realName:string;  // 用户名
    userName:string;  // 用户名
    phoneNum:string;  // 手机号
    nowCount:number;  // 倒计时
    phoneCode:string;  // 手机验证码
    inviteCode:string;  // 邀请码
    fcode:string;  // 已绑过的邀请码 只有海宝升级海王时不能修改
    selected:string; // 选择的礼包
    address:any;  // 地址
    isVip:boolean; // 是否是会员
    changePhone:boolean; // 是否修改手机号
}
/**
 * 领取礼包填写地址
 */
export class FillAddrModalBox extends Widget {
    public ok:(addr:any) => void;  // 选择的地址详情
    public cancel:() => void;
    public props:Props;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props,
            addressFormat
        };
        super.setProps(this.props);
        this.props.address = getLastAddress()[2];
        this.props.isVip = getStore('user/userType') <= UserType.hBao;
        if (!this.props.isVip) {
            const user = getStore('user');
            if (user.IDCard) {// 有身份证号，表示实名认证成功，不允许再修改名字
                this.props.realName = user.realName;
            }
            this.props.userName = user.realName;
            this.props.phoneNum = user.phoneNum;
            this.props.changePhone = !user.phoneNum;
            this.props.inviteCode = localInviteCode || user.fcode;  // 分享人的邀请码
        }
    }

    // 选择地址
    public selAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(num) => {
            const address = getStore('mall/addresses');
            this.props.address = address[num];
            this.paint();
        });
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
        }
    }

    // 获取邀请码
    public getInvoteCode() {
        randomInviteCode(3).then(r => {
            this.props.inviteCode = r.code;
            this.paint();
        });
    }

    // 确认
    // tslint:disable-next-line:cyclomatic-complexity
    public async confirm() {
        if (this.props.address && this.props.isVip) {
            this.ok && this.ok(this.props.address);
        } else if (this.props.isVip) {
            popNewMessage('请选择地址');

        } else { // 非会员领取试用装
            if (!this.props.userName || !this.props.phoneNum || (!this.props.phoneCode && this.props.changePhone) || !this.props.inviteCode || !this.props.address) {
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
    
                try {   // 绑定邀请码
                    const code = await bindUser(this.props.inviteCode,3);
                    if (code) setStore('user/fcode',this.props.inviteCode);
    
                } catch (err) {
                    loadding.callback(loadding.widget);
                    popNewMessage('邀请码填写有误');
    
                    return;
                }
                
                loadding.callback(loadding.widget);
                this.ok && this.ok(this.props.address);  // 所有接口都请求成功后关闭弹窗
            }
        }
        
    }

    // 取消
    public close() {
        this.cancel && this.cancel();
    }
}