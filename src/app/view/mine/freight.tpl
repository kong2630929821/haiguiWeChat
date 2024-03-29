<div class="new-page" w-class="new-page">
    {{if it.shipId.length > 0}}
        {{for i,v of it.shipId}}
            <div w-class="row row1">
                <div w-class="order">
                    <div style="white-space: nowrap;">{{it.ShipperName[i]}}</div>
                    <div style="color:#000;font-weight: normal;margin-left: 10px;word-break:break-all;">{{v}}</div>
                </div>
                <img src="../../res/image/copy.png" w-class="copy" on-tap="copyClick"/>
            </div>
            <div w-class="process-box">
                {{for j,r of it.traces[i] || []}}
                <div w-class="process">
                    <div>{{r.context}}</div>
                    <div style="font-size: 26px;margin-top: 10px;">{{r.time}}</div>
                </div>
                {{end}}
            </div>
        {{end}}
    {{else}}
        <div w-class="process-box">
            <div w-class="process">
                <div>商品等待揽收</div>
                <div style="font-size: 26px;margin-top: 10px;">{{it.shipTimeShow}}</div>
            </div>
        </div>
    {{end}}
</div>