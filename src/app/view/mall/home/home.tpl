<div w-class="new-page" class="new-page">
    <div style="height:350px;width:100%;" ev-click-slide="groupsClick">
        <app-components-imgSwiper-imgSwiper>{ list:{{ it1.groups.get(it.GroupsLocation.FIRST) || [] }},mod:1 }</app-components-imgSwiper-imgSwiper>
    </div>
    <div style="margin-top:20px;" ev-click-groups-one="groupsClick">
        <app-components-groups1-groups1>{ list:{{ it1.groups.get(it.GroupsLocation.SECOND) || [] }} }</app-components-groups1-groups1>
    </div>
    <div style="padding:0 30px;" >
        <div w-class="container">
            {{:location3 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.THIRD)}}
            <div w-class="group1" class="bg-img {{location3 ? '' : 'no-group'}}" style="background-image:url(../../../res/image/{{location3 ? it.getImageThumbnailPath(location3.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.THIRD}})"></div>
            <div w-class="groups">
                {{:location4 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FOUR)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FOUR}})" style="padding-right:5px;">
                    <div style="background-image:url(../../../res/image/{{location4 ? it.getImageThumbnailPath(location4.images) : ''}});border-radius:6px;" class="bg-img {{location4 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location5 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FIVE)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FIVE}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location5 ? it.getImageThumbnailPath(location5.images) : ''}});border-radius:6px;" class="bg-img {{location5 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location6 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SIX)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SIX}})" style="padding-right:5px">
                    <div style="background-image:url(../../../res/image/{{location6 ? it.getImageThumbnailPath(location6.images) : ''}});border-radius:6px;" class="bg-img {{location6 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location7 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SEVEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SEVEN}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location7 ? it.getImageThumbnailPath(location7.images) : ''}});border-radius:6px;" class="bg-img {{location7 ? '' : 'no-group'}}" ></div>
                </div>
            </div>  
        </div>
        <div w-class="container">
            {{:location8 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.EIGHT)}}
            <div w-class="group1" class="bg-img {{location8 ? '' : 'no-group'}}" style="background-image:url(../../../res/image/{{location8 ? it.getImageThumbnailPath(location8.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.EIGHT}})"></div>
            <div w-class="groups">
                {{:location9 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.NINE)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.NINE}})" style="padding-right:5px;">
                    <div style="background-image:url(../../../res/image/{{location9 ? it.getImageThumbnailPath(location9.images) : ''}});border-radius:6px;" class="bg-img {{location9 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location10 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.TEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.TEN}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location10 ? it.getImageThumbnailPath(location10.images) : ''}});border-radius:6px;" class="bg-img {{location10 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location11 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.ELEVEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.ELEVEN}})" style="padding-right:5px">
                    <div style="background-image:url(../../../res/image/{{location11 ? it.getImageThumbnailPath(location11.images) : ''}});border-radius:6px;" class="bg-img {{location11 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location12 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.TWLEVE)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.TWLEVE}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location12 ? it.getImageThumbnailPath(location12.images) : ''}});border-radius:6px;" class="bg-img {{location12 ? '' : 'no-group'}}" ></div>
                </div>
            </div>  
        </div>
        <div w-class="container">
            {{:location13 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.THIRTEEN)}}
            <div w-class="group1" class="bg-img {{location13 ? '' : 'no-group'}}" style="background-image:url(../../../res/image/{{location13 ? it.getImageThumbnailPath(location13.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.THIRTEEN}})"></div>
            <div w-class="groups">
                {{:location14 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FOURTEEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FOURTEEN}})" style="padding-right:5px;">
                    <div style="background-image:url(../../../res/image/{{location14 ? it.getImageThumbnailPath(location14.images) : ''}});border-radius:6px;" class="bg-img {{location14 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location15 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FIFTEEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FIFTEEN}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location15 ? it.getImageThumbnailPath(location15.images) : ''}});border-radius:6px;" class="bg-img {{location15 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location16 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SIXTEEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SIXTEEN}})" style="padding-right:5px">
                    <div style="background-image:url(../../../res/image/{{location16 ? it.getImageThumbnailPath(location16.images) : ''}});border-radius:6px;" class="bg-img {{location16 ? '' : 'no-group'}}" ></div>
                </div>
                {{:location17 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SEVENTEEN)}}
                <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SEVENTEEN}})" style="padding-left:5px;">
                    <div style="background-image:url(../../../res/image/{{location17 ? it.getImageThumbnailPath(location17.images) : ''}});border-radius:6px;" class="bg-img {{location17 ? '' : 'no-group'}}" ></div>
                </div>
            </div>  
        </div>
    </div>
</div>