import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            value:{
                type:'text',
                value:''
            },
            type: {
                type: 'selection',
                items: ['date', 'daterange', 'datetime', 'datetimerange', 'year', 'month'],
                value: ''
            },
            format: {
                type: 'text',
                value: ''
            },
            placement: {
                type: 'selection',
                items: ['toptop', 'starttop', 'endbottombottom', 'startbottom', 'endleftleft', 'startleft', 'endrightright', 'startright', 'end'],
                value: ''
            },
            placeholder: {
                type: 'text',
                value: ''
            },
            confirm: {
                type: 'boolean',
                value: false
            },
            open: {
                type: 'boolean',
                value: false
            },
            size: {
                type: 'selection',
                items: ['large', 'small', ''],
                value: ''
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            clearable: {
                type: 'boolean',
                value: false
            },
            readonly: {
                type: 'boolean',
                value: false
            },
            editable: {
                type: 'boolean',
                value: false
            },
            transfer: {
                type: 'boolean',
                value: false
            }
        },
        slots = {}

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
    let template = `<Date-picker 
                        ${stringAttr}>
                        ${subContent}
                    </Date-picker>`

    return { template, attributes, slots }
}
export default handle
