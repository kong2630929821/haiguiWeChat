<div style="height:100%;width:100%;position: relative;">
    <div class="swiper-container" style="height:100%;width:100%;">
        <div class="swiper-wrapper" on-tap="clickSlide">
            {{for i,v of it.list}}
            {{: let path = it.mod === 1 ? it.getImageThumbnailPath(v.images) : v}}
            <div class="swiper-slide bg-img" style="background-image:url(../../res/image/{{path}});"></div>
            {{end}}
        </div>
    </div>
    <div w-class="navigation">{{it.activeIndex}}/{{it.list.length}}</div>
</div>