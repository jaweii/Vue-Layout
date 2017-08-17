import { getTemplate, getSlotContent, getStringTypeAttr  } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            icon:{
                type:'icon',
                value:''
            },
            iconClass:{
                type:'text',
                value:''
            },
            title:{
                type:'text',
                value:''
            },
            titleClass:{
                type:'text',
                value:''
            },
            value:{
                type:'text',
                value:''
            },
            href:{
                type:'text',
                value:''
            },
            tag:{
                type:'text',
                value:''
            },
            activeClass:{
                type:'text',
                value:''
            },
            exact:{
                type:'boolean',
                value:false
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
    let template = `<mu-bottom-nav-item 
                    	${stringAttr}>
                        ${subContent}
                    </mu-bottom-nav-item>`

    return { template, attributes, slots }
}
export default handle
