import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            icon: {
                type: 'icon',
                value: 'add'
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            type: {
                type: 'selection',
                value: '',
                items: ['submit', 'button', 'reset']
            },
            href: {
                type: 'text',
                value: ''
            },
            target: {
                type: 'selection',
                value: '',
                items: ['_blank', 'self', '_parent', '_top']
            },
            tag: {
                type: 'text',
                value: ''
            },
            exact: {
                type: 'boolean',
                value: false
            },
            secondary:{
            	type:'boolean',
            	value:false
            },
            mini:{
            	type:'booleam',
            	value:false
            },
            backgroundColor:{
            	type:'color',
            	value:''
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
    let template = `<mu-float-button 
                        ${stringAttr}>
                        ${subContent}
                    </mu-float-button>`

    return { template, attributes, slots }
}
export default handle
