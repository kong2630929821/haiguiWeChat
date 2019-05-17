<div class="new-page" w-class="new-page">
    {{if it.order.ship_id}}
        <div w-class="row row1">
            <div w-class="order">
                <span>{{it.ShipperName}}</span>&nbsp;<span style="color:#000;">{{it.order.ship_id}}</span>
            </div>
            <img src="../../res/image/copy.png" w-class="copy" on-tap="copyClick"/>
        </div>
        <div w-class="process-box">
        {{for i,v of it.traces}}
        <div w-class="process">
            <div>{{v.AcceptStation}}</div>
            <div style="font-size: 26px;margin-top: 10px;">{{v.AcceptTime}}</div>
        </div>
        {{end}}
        </div>
    {{else}}
        <div w-class="process-box">
            <div w-class="process">
                <div>商品等待揽收</div>
                <div style="font-size: 26px;margin-top: 10px;">{{it.shipTimeShow}}</div>
            </div>
        </div>
    {{end}}
</div>