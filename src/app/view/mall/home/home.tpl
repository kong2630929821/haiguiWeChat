<div w-class="new-page" class="new-page">
    <div style="height:350px;width:100%;" ev-click-slide="slideClick">
        <app-components-imgSwiper-imgSwiper>{ list:{{it1.firstGroups}},mod:1 }</app-components-imgSwiper-imgSwiper>
    </div>
    <div style="margin-top:20px;" ev-click-groups-one="groupsOneClick">
        <app-components-groups1-groups1>{ list:{{it1.secondGroups}} }</app-components-groups1-groups1>
    </div>
    <div style="padding:0 30px;" >
        {{for i,v of it1.thirdGroups}}
        <div ev-click-groups-two="groupsTwoClick" style="margin-top:30px;"><app-components-groups2-groups2>{ list:{{v}} }</app-components-groups2-groups2></div>
        {{end}}
    </div>
</div>