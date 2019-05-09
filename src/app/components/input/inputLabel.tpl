{{: ty = it.itype == 'password' ? 'password' : 'text'}}
<div w-class="pi-input-box {{it1.focused?'focus':''}}" class="pi-input">
    <div style="display:flex;align-items: center;">
        {{if it.label}}
        <div style="width:160px;flex-shrink: 0;">{{it.label}}</div>
        {{end}}
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
    </div>
</div>