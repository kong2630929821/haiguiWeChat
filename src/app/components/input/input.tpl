{{: ty = it.itype == 'password' ? 'password' : 'text'}}
<div w-class="pi-input-box {{it1.focused?'focus':''}}" class="pi-input">
    <input 
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="{{ty}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend"
    />
    {{if it1.showClear}}
    <img w-class="clearBtn" src="../../res/image/close.png" on-tap="clearClickListener"/>
    {{end}}
</div>