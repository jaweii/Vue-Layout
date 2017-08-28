import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'

var handle = function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            type:{
                type:'selection',
                items:['text','password','textarea'],
                value:''
            },
            value:{
                type:'text',
                value:''
            },
            size:{
                type:'selection',
                items:['large','small',''],
                value:''
            },
            placeholder:{
                type:'text',
                value:''
            },
            readonly:{
                type:'text',
                value:''
            },
            maxlength:{
                type:'number',
                value:''
            },
            icon:{
                type:'ionicon',
                value:''
            },
            rows:{
                type:'number',
                value:''
            },
            autosize:{
                type:'boolean',
                value:false
            },
            number:{
                type:'boolean',
                value:''
            },
            autofoucs:{
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
    let template = `<Input 
                        ${stringAttr}>
                        ${subContent}
                    </Input>`

    return { template, attributes, slots }
}
export default handle
