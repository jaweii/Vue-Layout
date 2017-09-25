import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            label:{
                type:'text',
                value:'Alert'
            },
            type:{
                type:'selection',
                items:['info','success','warning','error'],
                value:''
            },
            closable:{
                type:'boolean',
                value:false
            },
            ['show-icon']:{
                type:'boolean',
                value:false
            },
            banner:{
                type:'boolean',
                value:false
            }
        },
        slots = {
            desc:[],
            icon:[],
            close:[]
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
    let template = `<Alert 
                        ${stringAttr}>
                        ${attributes.label.value}${subContent}
                    </Alert>` 
    //删除自定义非ui属性
    template = template.replace(`label="${attributes.label.value}"`, '')

    return { template, attributes, slots }
}
export default handle
