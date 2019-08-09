<div class="new-page" ev-back-click="backPrePage">
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="../../res/image/logo.png" w-class="logoimg"/>
        </div>
        
        {{for i,v of it.data}}
            <div on-tap="itemClick({{i}})" w-class="item">
                <div w-class="itemName">{{v[0]}}</div>
                <div w-class="itemDesc">{{v[1]}}</div>
                <img src="../../res/image/arrowRight.png" w-class="itemImg"/>
            </div>
        {{end}}
    </div>
</div>