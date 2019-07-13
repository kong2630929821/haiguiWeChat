<div class="new-page" w-class="page">
    {{if it.giftType === 'A'}}
    <div w-class="contain">
        <img src="../../res/image/giftA1.png" w-class="image"/>
        <div w-class="closePage">
            <img src="../../res/image/closeGift.png" w-class="close" on-tap="close"/>
        </div>
    </div>
    {{else}}
    <div w-class="contain">
        <img src="../../res/image/giftB1.png" w-class="image"/>
        <div w-class="closePage">
            <img src="../../res/image/closeGift.png" w-class="close" on-tap="close"/>
        </div>
    </div>
    {{end}}
</div>