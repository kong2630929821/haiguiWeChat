<div class="new-page" w-class="new-page">
    <div w-class="modal">
        <div w-class="text">是否同意授权昵称及头像？</div>
        <div w-class="select">
            <img src="../../res/image/{{it.selected?'selectBox_active.png':'selectBox.png'}}" w-class="img" on-tap="choose"/>
            <span>
                已阅读并同意
                <b style="font-weight:normal;color: #8A4AF3" on-tap="read">《海龟壹号会员服务协议》</b>
            </span>
        </div>
        <div w-class="btns">
            <div w-class="btn btn-cancel" on-tap="cancelClick">取消</div>
            <div w-class="btn btn-ok" on-tap="okClick">确定</div>
        </div>
    </div>
</div>