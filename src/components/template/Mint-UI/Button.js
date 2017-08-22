import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            label: {
                type: 'text',
                value: '按钮'
            },
            plain:{
                type:'boolean',
                value:''
            },
            type:{
                type:'selection',
                items:['default','primary','danger'],
                value:'default'
            },
            size:{
                type:'selection',
                items:['small','normal','large'],
                value:''
            },
            icon:{
                type:'selection',
                items:['more','back'],
                value:''
            }
        },
        slots = {
            default:[],
            icon:[]
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
    let template = `<mt-button 
                        ${stringAttr}>${subContent}
                            ${attributes.label.value}
                        </mt-button>`
        //删除自定义非ui属性
    template = template.replace(`:label="${attributes.label.value}"`, '')
    return { template, attributes, slots }
}
export default handle
