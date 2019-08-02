<div class="new-page" w-class="page" >
    <div w-class="giftBox">
        <img src="../../res/image/{{it.img}}" style="max-width:100%;"/>
        {{% ========================基础礼包======================}}
        {{if it.fg == 1 && it.isCurVip}}
        <div w-class="shareBtn1" on-tap="freeReceive">{{it.btn}}</div>
        
        {{% ========================尊享礼包======================}}
        {{elseif it.fg == 2 && it.isCurVip}}
        <div w-class="shareBtn1" on-tap="freeReceive">{{it.btn}}</div>
        
        {{% ========================试用装领取======================}}
        {{elseif it.fg == 3 && it.isCurVip}}
        <div>
            {{if it.ableGain}}
            <div w-class="shareBtn1" on-tap="freeReceive">{{it.btn}}</div>
            {{else}}
            <div w-class="shareBtn1" on-tap="share">分享给好友</div>
            {{end}}
        </div>
        
        {{% ========================线下课程======================}}
        {{elseif it.fg == 4 && it.isCurVip}}
        <div>
            {{if !it.ableGain}}
            <div w-class="shareBtn1" on-tap="share">分享给好友</div>
            {{else}}
            <div w-class="shareBtn1" on-tap="applyClass">{{it.btn}}</div>
            {{end}}
        </div>
        
        {{% ========================海宝积分折扣======================}}
        {{elseif it.fg==7 && it.isCurVip && it.userType==2}}
        <div w-class="btn">已领取</div>
    
        {{% ========================邀请好友，海王可以邀请开通海王======================}}
        {{elseif it.fg==6 && it.isCurVip}}
        <div w-class="inviteCode" on-tap="copyCode">我的邀请码&nbsp;{{it.inviteCode}}&nbsp;<span style="text-decoration: underline;">点击复制</span></div>
        <div w-class="invites">
            <div w-class="invitebtn" on-tap="share(true,'hBao')">邀请好友开通海宝</div>
            {{if it.userType == 1}}
            <div w-class="invitebtn" on-tap="share(true,'hWang')">邀请好友开通海王</div>
            {{end}}
        </div>
        
        {{% ========================精品课程，销售课程======================}}
        {{elseif (it.fg ==8 || it.fg ==9) && it.isCurVip }}
        <div w-class="shareBtn1" on-tap="applyClass">{{it.btn}}</div>
        {{end}}
    </div>
    <div style="display:inline-block;height:100%;vertical-align: middle;"></div>
</div>