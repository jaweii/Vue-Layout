import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            autoOk: {
                type: 'boolean',
                value: false
            },
            okLabel: {
                type: 'text',
                value: ''
            },
            cancelLabel: {
                type: 'text',
                value: ''
            },
            container: {
                type: 'selection',
                value: '',
                items: ['inline', 'dialog']
            },
            mode: {
                type: 'selection',
                value: '',
                items: ['portrait', 'landscape']
            },
            format: {
                type: 'text',
                value: ''
            },
            label: {
                type: 'text',
                value: ''
            },
            labelFloat: {
                type: 'boolean',
                value: false
            },
            labelClass: {
                type: 'text',
                value: ''
            },
            labelFocusClass: {
                type: 'text',
                value: ''
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            hintText: {
                type: 'text',
                value: ''
            },
            hintTextClass: {
                type: 'text',
                value: ''
            },
            helpText: {
                type: 'text',
                value: ''
            },
            helpTextClass: {
                type: 'text',
                value: ''
            },
            errorText: {
                type: 'text',
                value: ''
            },
            errorColor: {
                type: 'color',
                value: ''
            },
            icon: {
                type: 'icon',
                value: ''
            },
            iconClass: {
                type: 'text',
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
            underlineClass: {
                type: 'text',
                value: ''
            },
            underlneFocusClass: {
                type: 'text',
                value: ''
            },
            inputClass: {
                type: 'text',
                value: ''
            },
            value: {
                type: 'text',
                value: ''
            }
        },
        slots = {
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots)

    //设置当前组件的slot
    if (attributes.slot && attributes.slot !== 'default') {
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
    let template = `<mu-time-picker 
                    ${stringAttr}>
                    ${subContent}
                </mu-time-picker>`

    return { template, attributes, slots }
}
export default handle
