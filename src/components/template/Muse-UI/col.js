import { getTemplate, getSlotContent, getStringTypeAttr  } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            width: {
                type: 'slider',
                value: 20,
                max: 100,
                min: 0,
                step: 5,
                notBind:true     //notBind属性告诉模板处理函数，value作为字符串传入，不用v-bind
            },
            tablet: {
                type: 'slider',
                value: 20,
                max: 100,
                min: 0,
                step: 5,
                notBind:true
            },
            desktop: {
                type: 'slider',
                value: 20,
                max: 100,
                min: 0,
                step: 5,
                notBind:true
            },
        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots) || '&nbsp;'
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
    let template = `<mu-col 
                    	${stringAttr}>
                        ${subContent}
                    </mu-col>`

    return { template, attributes, slots }
}
export default handle
