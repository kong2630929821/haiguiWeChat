<div class="new-page" w-class="page">
    <div w-class="contain">
        <div w-class="title">填写地址</div>
        <div w-class="row">
            <div w-class="addr">{{it.address ? it.address.address:"详细地址"}}</div>
            <div w-class="btn" on-tap="selAddr">选择地址</div>
        </div>
        <div w-class="btns">
            <div w-class="cancel" on-tap="close">取消</div>
            <div w-class="sure" on-tap="confirm">确定</div>
        </div>
    </div>
</div>