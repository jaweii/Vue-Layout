import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            prop: {
                type: 'text',
                value: ''
            },
            label: {
                type: 'text',
                value: ''
            },
            ['label-width']: {
                type: 'number',
                value: ''
            },
            required: {
                type: 'boolean',
                value: false
            },
            rules: {
                type: 'number',
                value: ''
            },
            error: {
                type: 'text',
                value: ''
            },
            ['show-message']: {
                type: 'text',
                value: ''
            }
        },
        slots = {
            default: [],
            label: []
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
    let template = `<FormItem 
                        ${stringAttr}>
                        ${subContent || '&nbsp;'}
                    </FormItem>`

    return { template, attributes, slots }
}
export default handle
