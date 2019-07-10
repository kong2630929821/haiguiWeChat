<div class="new-page" w-class="page">
    <div ev-btn-click="btnClick" style="background:#fff;">
        <widget w-tag="app-view-mine-orderItem">{order:{{it.order}},status:4 }</widget>
    </div>

    <div w-class="item">
        <span w-class="itemName">退货原因</span>
        <div on-tap="selectReason" w-class="select">{{it.reason?it.reason:"请选择"}}<img src="../../res/image/arrowRight.png"/></div>
    </div>

    <div w-class="item" ev-input-change="descChange">
        <span w-class="itemName">退货备注</span>
        <widget w-tag="app-components-input-textarea">{placeHolder:"请输入",style:"font-size:28px;height:auto;max-height:200px;" }</widget>
    </div>

    <div w-class="item">
        <span w-class="itemName">上传凭证(最多三张)</span>
        <div style="display:flex">
            {{for i,v of it.imgs}}
            <div w-class="uploadImg">
                <widget w-tag="app-components-img-img">{width:"140px",isRound:false,imgURL:{{v}} }</widget>
                <img src="../../res/image/close.png" w-class="closeBtn" on-tap="delImg({{i}})"/>
            </div>
            {{end}}

            {{if it.imgs.length < 3}}
            <div w-class="uploadImg" on-tap="chooseImg">
                <img src="../../res/image/camera.png"/>
            </div>
            {{end}}
        </div>
    </div>

    <div w-class="btn" on-tap="confirm">提交</div>
</div>