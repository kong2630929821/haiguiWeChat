<div class="new-page" w-class="page" style="background:{{it.fg==2?'#FFF5F9':''}}">
    <img src="../../res/image/{{it.img}}"/>
    {{% ========================基础礼包======================}}
    {{if it.fg == 1 && it.isCurVip}}
    <div w-class="btn" style="color:#2D681B" on-tap="freeReceive">{{it.btn}}</div>
    
    {{% ========================尊享礼包======================}}
    {{elseif it.fg == 2 && it.isCurVip}}
    <div w-class="btn" style="color:#EC3760" on-tap="freeReceive">{{it.btn}}</div>
    
    {{% ========================试用装领取======================}}
    {{elseif it.fg == 3 && it.isCurVip}}
    <div>
        {{if it.ableGain}}
        <div w-class="btn1" on-tap="freeReceive">{{it.btn}}</div>
        {{else}}
        <div w-class="shareBtn1" on-tap="share">分享给好友</div>
        {{end}}
    </div>
    
    {{% ========================线下课程======================}}
    {{elseif it.fg == 4 && it.isCurVip}}
    <div style="display: flex;align-items: center;">
        {{if !it.ableGain}}
        <div w-class="shareBtn" on-tap="share">分享给好友</div>
        {{else}}
        <div w-class="btn" style="width: 200px;" on-tap="applyClass">{{it.btn}}</div>
        {{end}}
    </div>
    
    {{% ========================开通获得积分======================}}
    {{elseif it.fg==5 && !it.isCurVip}}
    <div w-class="open" on-tap="openVIP">立即开通</div>

    {{% ========================邀请好友，海王可以邀请开通海王======================}}
    {{elseif it.fg==6 && it.isCurVip}}
    <div w-class="invites">
        <div w-class="invitebtn" on-tap="inviteShare('hBao')">邀请好友开通海宝</div>
        {{if it.userType == 1}}
        <div w-class="invitebtn" on-tap="inviteShare('hWang')">邀请好友开通海王</div>
        {{end}}
    </div>
    
    {{% ========================精品课程，销售课程======================}}
    {{elseif (it.fg ==8 || it.fg ==9) && it.isCurVip }}
    <div w-class="btn" style="margin-top:40;" on-tap="applyClass">{{it.btn}}</div>
    {{end}}
</div>