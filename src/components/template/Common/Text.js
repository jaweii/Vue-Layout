import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            text: {
                type: 'text',
                value: ''
            }
        },
        slots = {}

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots) || '&nbsp;'
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
    let text = JSON.parse(JSON.stringify(attributes)).text.value || 'Text'
    let stringAttr = getStringTypeAttr(attributes)
    let template = `<span ${stringAttr}>${text}</span>`

    template = template.replace(/text=".*?"/g, '')//模板字符串中删除text属性

    return { template, attributes, slots }
}
export default handle
