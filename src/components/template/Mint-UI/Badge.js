import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            text: {
                type: 'text',
                value: '按钮'
            },
            type:{
                type:'selection',
                items:['primary','error','success','warning'],
                value:''
            },
            color:{
                type:'color',
                value:''
            },
            size:{
                type:'selection',
                items:['normal','large','small'],
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
    let template = `<mt-badge 
                        ${stringAttr}>${subContent}
                            ${attributes.text.value}
                        </mt-badge>`
        //删除自定义非ui属性
    template = template.replace(`:text="${attributes.text.value}"`, '')
    return { template, attributes, slots }
}
export default handle
