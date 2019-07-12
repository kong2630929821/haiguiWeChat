<div w-class="new-page" class="new-page">
    <div w-class="input">
        <div w-class="searchBox" on-tap="goSearch">搜索想买的商品</div>
        <img w-class="searchIcon" src="../../../res/image/search-gray.png" />
    </div>
    <div id="scroll-container" on-scroll="getMoreList" w-class="scroll-container">
        <div id="scroll-content">
            <div style="height:350px;width:100%;" ev-click-slide="groupsClick">
                <app-components-imgSwiper-imgSwiper>{ list:{{ it1.groups.get(it.GroupsLocation.FIRST) || [] }},mod:1 }</app-components-imgSwiper-imgSwiper>
            </div>
            <div style="margin-top:20px;" ev-click-groups-one="groupsClick">
                <app-components-groups1-groups1>{ list:{{ it1.groups.get(it.GroupsLocation.SECOND) || [] }} }</app-components-groups1-groups1>
            </div>
            <div style="padding:0 30px;" >
                <div w-class="container">
                    {{:location3 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.THIRD)}}
                    {{if location3}}
                    <div w-class="group1" class="bg-img" style="background-image:url({{location3 ? it.mallImagPre + it.getImageThumbnailPath(location3.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.THIRD}})"></div>
                    {{end}}
                    <div w-class="groups">
                        {{:location4 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FOUR)}}
                        {{if location4}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FOUR}})" style="padding-right:5px;">
                            <div style="background-image:url({{location4 ? it.mallImagPre + it.getImageThumbnailPath(location4.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location5 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FIVE)}}
                        {{if location5}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FIVE}})" style="padding-left:5px;">
                            <div style="background-image:url({{location5 ? it.mallImagPre + it.getImageThumbnailPath(location5.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location6 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SIX)}}
                        {{if location6}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SIX}})" style="padding-right:5px">
                            <div style="background-image:url({{location6 ? it.mallImagPre + it.getImageThumbnailPath(location6.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location7 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SEVEN)}}
                        {{if location7}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SEVEN}})" style="padding-left:5px;">
                            <div style="background-image:url({{location7 ? it.mallImagPre + it.getImageThumbnailPath(location7.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>  
                </div>
                <div w-class="container">
                    {{:location8 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.EIGHT)}}
                    {{if location8}}
                    <div w-class="group1" class="bg-img" style="background-image:url({{location8 ? it.mallImagPre + it.getImageThumbnailPath(location8.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.EIGHT}})"></div>
                    {{end}}
                    <div w-class="groups">
                        {{:location9 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.NINE)}}
                        {{if location9}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.NINE}})" style="padding-right:5px;">
                            <div style="background-image:url({{location9 ? it.mallImagPre + it.getImageThumbnailPath(location9.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location10 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.TEN)}}
                        {{if location10}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.TEN}})" style="padding-left:5px;">
                            <div style="background-image:url({{location10 ? it.mallImagPre + it.getImageThumbnailPath(location10.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location11 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.ELEVEN)}}
                        {{if location11}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.ELEVEN}})" style="padding-right:5px">
                            <div style="background-image:url({{location11 ? it.mallImagPre + it.getImageThumbnailPath(location11.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location12 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.TWLEVE)}}
                        {{if location12}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.TWLEVE}})" style="padding-left:5px;">
                            <div style="background-image:url({{location12 ? it.mallImagPre + it.getImageThumbnailPath(location12.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>  
                </div>
                <div w-class="container">
                    {{:location13 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.THIRTEEN)}}
                    {{if location13}}
                    <div w-class="group1" class="bg-img" style="background-image:url({{location13 ? it.mallImagPre + it.getImageThumbnailPath(location13.images) : ''}});" on-tap="groupsLocationClick(e,{{it.GroupsLocation.THIRTEEN}})"></div>
                    {{end}}
                    <div w-class="groups">
                        {{:location14 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FOURTEEN)}}
                        {{if location14}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FOURTEEN}})" style="padding-right:5px;">
                            <div style="background-image:url({{location14 ? it.mallImagPre + it.getImageThumbnailPath(location14.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location15 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.FIFTEEN)}}
                        {{if location15}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.FIFTEEN}})" style="padding-left:5px;">
                            <div style="background-image:url({{location15 ? it.mallImagPre + it.getImageThumbnailPath(location15.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location16 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SIXTEEN)}}
                        {{if location16}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SIXTEEN}})" style="padding-right:5px">
                            <div style="background-image:url({{location16 ? it.mallImagPre + it.getImageThumbnailPath(location16.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                        {{:location17 =  it.getFixLocationGroup(it1.groups,it.GroupsLocation.SEVENTEEN)}}
                        {{if location17}}
                        <div w-class="group2"  on-tap="groupsLocationClick(e,{{it.GroupsLocation.SEVENTEEN}})" style="padding-left:5px;">
                            <div style="background-image:url({{location17 ? it.mallImagPre + it.getImageThumbnailPath(location17.images) : ''}});border-radius:6px;" class="bg-img" ></div>
                        </div>
                        {{end}}
                    </div>  
                </div>
            </div>

            <div w-class="like-goods-box">
                <div w-class="like-title">猜你喜欢</div>
                <div w-class="goods-list"  >
                    <div w-class="goods-list-items">
                        {{for i,v of it1.likedGoods}}
                        <div w-class="goods-item" style="{{i % 2 === 0 ? 'padding-right:5px;' : 'padding-left:5px;'}}" ev-item-click="goodsItemClick(e,{{i}})">
                            <app-components-goodsItem-goodsItem>{goods:{{v}} }</app-components-goodsItem-goodsItem>
                        </div>
                        {{end}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>