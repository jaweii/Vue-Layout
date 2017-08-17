import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            name: {
                type: 'text',
                value: ''
            },
            type: {
                type: 'selection',
                value: 'text',
                items: ['text', 'password', 'email', 'url', 'number']
            },
            icon: {
                type: 'icon',
                value: ''
            },
            iconClass:{
                type:'text',
                value:''
            },
            label: {
                type: 'text',
                value: ''
            },
            labelFloat: {
                type: 'boolean',
                value: false
            },
            labelClass:{
                type:'text',
                value:''
            },
            labelFocusClass:{
                type:'text',
                value:''
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            hintText: {
                type: 'text',
                value: '提示文字'
            },
            hintTextClass:{
                type:'text',
                value:''
            },
            helpText: {
                type: 'text',
                value: ''
            },
            helpTextClass:{
                type:'text',
                value:''
            },
            errorText: {
                type: 'text',
                value: ''
            },
            errorColor: {
                type: 'color',
                value: ''
            },
            fullWidth: {
                type: 'boolean',
                value: false
            },
            underlineShow: {
                type: 'boolean',
                value: false
            },
            underlineClass:{
                type:'text',
                value:''
            },
            underlineFocusClass:{
                type:'text',
                value:''
            },
            inputClass:{
                type:'text',
                value:''
            },
            multiLine: {
                type: 'boolean',
                value: false
            },
            rows: {
                type: 'number',
                value: ''
            },
            rowsMax: {
                type: 'number',
                value: ''
            },
            maxLength: {
                type: 'number',
                value: ''
            },
            value: {
                type: 'text',
                value: ''
            },
            max: {
                type: 'number',
                value: ''
            },
            min: {
                type: 'number',
                value: ''
            },
            required: {
                type: 'boolean',
                value: false
            }


        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots)

    //设置当前组件的slot
    if (attributes.slot && attributes.slot!=='default') {
        attributes.slot = {
            type: 'text',
            value: attributes.slot
        }
    } else {
        attributes.slot = {
            type: 'text',
            value: ''
        }
    }

    //字符串模板操作
    let stringAttr = getStringTypeAttr(attributes)
    let template = `<mu-text-field 
                        ${stringAttr}>
                        ${subContent}
                    </mu-text-field>`

    return { template, attributes, slots }
}
export default handle
