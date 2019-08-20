import { popNew } from '../../../pi/ui/root';
import { register } from '../../../pi/util/res_mgr';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { defaultInviteCode } from '../../config';
import { bindPhone, bindUser, randomInviteCode, sendCode, verifyIDCard } from '../../net/pull';
import { getStore, setStore, UserType } from '../../store/memstore';
import { getLastAddress, judgeRealName } from '../../utils/logic';
import { addressFormat, checkPhone, popNewLoading, popNewMessage } from '../../utils/tools';
import { localInviteCode } from '../base/main';

interface Props {
    title?:string;   // 标题
    nowCount:number;  // 倒计时
    selected:string; // 选择的礼包
    needSelGift:boolean; // 是否需要选择礼包
    userType:UserType;  // 用户会员等级
    unaccalimed:boolean;// 开通未领取礼包
    address:any;  // 地址
    needAddress:boolean;  // 是否需要选择地址
    needInviteCode:boolean;  // 是否需要邀请码
    isShopping399:boolean;// 是否是399商品
    getInvoteCodeShow:boolean;// 是否显示推荐一个
}
interface State {
    realName:string;  // 用户名
    userName:string;  // 用户名
    phoneNum:string;  // 手机号
    phoneCode:string;  // 手机验证码
    inviteCode:string;  // 邀请码
    fcode:string;  // 已绑过的邀请码 只有海宝升级海王时不能修改
    changePhone:boolean; // 是否修改手机号
}
export const forelet = new Forelet();

/**
 * 填信息输入框弹窗
 */
export class ModalBoxInput extends Widget {
    public ok:(data:any) => void;  // 地址信息
    public cancel:() => void;
    public state:State;
    public props:Props = {
        nowCount:0,
        selected:'A',
        needSelGift:true,
        userType:UserType.hBao,
        unaccalimed:false,
        address:'',
        needAddress:false,
        needInviteCode:true,
        isShopping399:false,
        getInvoteCodeShow:false
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props,
            addressFormat
        };
        super.setProps(this.props);
        this.props.address = getLastAddress()[2];
        if (this.props.userType === UserType.hWang) {
            this.props.needSelGift = false;   // 升级海王不需要选则礼包
        }

        const user = getStore('user');
        if (user.IDCard) {// 有身份证号，表示实名认证成功，不允许再修改名字
            STATE.realName = user.realName;
        }
        STATE.userName = user.realName;
        STATE.phoneNum = user.phoneNum;
        STATE.changePhone = !user.phoneNum;  // 已经绑过则默认不修改手机号
        if (user.userType <= UserType.hBao) {   // 成为会员后不允许修改父级邀请码
            STATE.fcode = user.hwcode;
            console.log('用户信息！！！！',user,`this.props.fcode-------${STATE.fcode}`);
        }
        STATE.inviteCode = this.props.isShopping399 ? '' :(localInviteCode || user.fcode);  // 分享人的邀请码
        this.state = STATE;
    }

    // 输入用户名
    public nameChange(e:any) {
        this.state.userName = e.value;
        this.paint();
    }

    // 输入手机号
    public phoneChange(e:any) {
        this.state.phoneNum = e.value;
        this.state.changePhone = e.value !== getStore('user/phoneNum');
        this.paint();
    }

    // 输入手机验证码
    public phoneCodeChange(e:any) {
        this.state.phoneCode = e.value;
        this.paint();
    }

    // 输入邀请码
    public inviteCodeChange(e:any) {
        this.state.inviteCode = e.value;
        this.paint();
    }

    // 获取手机验证码
    public getPhoneCode() {
        if (!checkPhone(this.state.phoneNum)) {
            popNewMessage('手机号格式错误');
        } else {
            sendCode(this.state.phoneNum).then(r => {
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
        // const t = this.props.userType === UserType.hWang ? 1 :3;
        // randomInviteCode(t).then(r => {  // 升级海王只能获取海王邀请码
        //     this.state.inviteCode = r.code;
        //     this.paint();
        // });
        this.state.inviteCode = this.state.fcode ? this.state.fcode :(this.state.inviteCode || defaultInviteCode);
        this.paint();
    }

    // 切换礼包选择
    public changeSel(sel:string) {
        popNew('app-view-member-giftAB',{ giftType:sel });
        this.props.selected = sel;
        this.paint();
    }

    // 选择地址
    public selAddr() {
        popNew('app-view-mine-addressList',{ isChoose:true },(num) => {
            const address = getStore('mall/addresses');
            this.props.address = address[num];
            this.paint();
        });
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
        if (!this.state.userName || !this.state.phoneNum || (!this.state.phoneCode && this.state.changePhone) || (this.props.needInviteCode && !this.state.inviteCode) || (this.props.needAddress && !this.props.address)) {
            popNewMessage('请将内容填写完整');
        } else if (!judgeRealName(this.state.userName)) {
            popNewMessage('请输入真实姓名');
            
        } else {
            const loadding = popNewLoading('请稍后');

            try {  // 验证手机号 修改过需要重新验证
                if (this.state.changePhone) {
                    const phoneRes = await bindPhone(this.state.phoneNum,this.state.phoneCode);
                    if (phoneRes) setStore('user/phoneNum',this.state.phoneNum);
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
                if (!this.state.realName) {
                    const nameRes = await verifyIDCard(this.state.userName,'','','','');
                    if (nameRes) setStore('user/realName',this.state.userName);
                }  
            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('用户名设置失败');

                return;
            }

            try {   // 绑定邀请码 非会员用户
                if (this.props.needInviteCode && !this.state.fcode) {
                    const t = this.props.userType === UserType.hWang ? 1 :3;
                    const code = await bindUser(this.state.inviteCode,t);
                    if (code) setStore('user/fcode',this.state.inviteCode);
                }

            } catch (err) {
                loadding.callback(loadding.widget);
                popNewMessage('邀请码填写有误');

                return;
            }
            
            loadding.callback(loadding.widget);
            this.ok && this.ok({ 
                sel:this.props.selected,
                addr:this.props.address 
            });  // 所有接口都请求成功后关闭弹窗
        }
    }

}

const STATE = {
    realName:'',
    userName:'',
    phoneNum:'',
    phoneCode:'',
    inviteCode:'',
    fcode:'',
    changePhone:true
};
register('user',user => {
    if (user) {
        if (user.IDCard) {// 有身份证号，表示实名认证成功，不允许再修改名字
            STATE.realName = user.realName;
        }
        STATE.userName = user.realName;
        STATE.phoneNum = user.phoneNum;
        STATE.changePhone = !user.phoneNum;  // 已经绑过则默认不修改手机号
        if (user.userType <= UserType.hBao) {   // 成为会员后不允许修改父级邀请码
            STATE.fcode = user.hwcode;
            console.log('用户信息！！！！',user,`this.props.fcode-------${STATE.fcode}`);
        }
        STATE.inviteCode = localInviteCode || user.fcode;  // 分享人的邀请码
        forelet.paint(STATE);
    }
});