import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            value: {
                type: 'slider',
                value: 0,
                max: _attr.max ? _attr.max.value : 100,
                min: _attr.min ? _attr.min.value : 0,
                step: _attr.step ? _attr.step.value : 1,
            },
            max: {
                type: 'number',
                value: ''
            },
            min: {
                type: 'number',
                value: ''
            },
            step: {
                type: 'number',
                value: ''
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            // range: {
            //     type: 'boolean',
            //     value: false
            // },
            ['show-input']: {
                type: 'boolean',
                value: false
            },
            ['show-stops']: {
                type: 'boolean',
                value: false
            },
            ['show-tip']: {
                type: 'boolean',
                value: false
            },
            ['tip-format']: {
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
    let template = `<Slider 
                        ${stringAttr}>
                        ${subContent}
                    </Slider>`

    return { template, attributes, slots }
}
export default handle
