<div w-class="pi-input-box {{it1.focused?'focus':''}}" class="chat-input" style="{{it && it.style ? it.style : ''}}">
    <div w-class="hideMsg">{{it1.currentValue?it1.currentValue:'1'}}</div>
    <textarea 
        unchange = "true"
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="text" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend">{{it1.currentValue}}</textarea>
        <div w-class="surplus">{{it.surplus}}</div>
</div>