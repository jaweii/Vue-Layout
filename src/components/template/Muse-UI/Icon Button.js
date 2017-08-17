import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            icon: {
                type: 'icon',
                value: 'insert_emoticon'
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
            tooltip:{
				type:'text',
				value:''
            },
            tooltipPosition:{
            	type:'selection',
            	value:'',
            	items:['top-left','top-right','top-center','middle-left','middle-right','middle-center','bottom-left','bottom-right','bottom-center']
            },
            touch:{
            	type:'boolean',
            	value:false
            },
            tag: {
                type: 'text',
                value: ''
            },
            exact: {
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
    let template = `<mu-icon-button 
                        ${stringAttr}>
                        ${subContent}
                    </mu-icon-button>`

    return { template, attributes, slots }
}
export default handle
