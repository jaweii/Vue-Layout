import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'
// 深度合并
import mergeDeep from '@/utils/mergeDeep'
var handle = function(_attr, _slots, { id }) {
    //定义默认属性
    let attributes = {
            itemQuantity: {
                type: 'number',
                value: 2
            },
            autoWidth:{
                type:'boolean',
                value:false
            },
            maxHeight:{
                type:'number',
                value:''
            },
            multiple:{
                type:'boolean',
                value:false
            },
            name:{
                type:'text',
                value:''
            },
            label:{
                type:'text',
                value:''
            },
            labelFloat:{
                type:'boolean',
                value:false
            },
            labelClass:{
                type:'text',
                value:''
            },
            labelFocusClass:{
                type:'text',
                value:''
            },
            disabled:{
                type:'boolean',
                value:false
            },
            hintText:{
                type:'text',
                value:''
            },
            hintTextClass:{
                type:'text',
                value:''
            },
            helpText:{
                type:'text',
                value:''
            },
            helpTextClass:{
                type:'text',
                value:''
            },
            errorText:{
                type:'text',
                value:''
            },
            errorColor:{
                type:'color',
                value:''
            },
            icon:{
                type:'icon',
                value:''
            },
            iconClass:{
                type:'text',
                value:''
            },
            fullWidth:{
                type:'boolean',
                value:false
            },
            underlineShow:{
                type:'boolean',
                value:false
            },
            underlineClass:{
                type:'text',
                value:''
            },
            underlineFocusClass:{
                type:'text',
                value:''
            },
            dropDownIconClass:{
                type:'text',
                value:''
            },
            value:{
                type:'text',
                value:''
            },
            separator:{
                type:'text',
                value:''
            }
        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)
    if (attributes.itemQuantity.value < 0)
        attributes.itemQuantity.value = 0

    //根据组件不同需要做的不同操作
    let max = _attr.itemQuantity ? _attr.itemQuantity.value : attributes.itemQuantity.value
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let component = components.find(c => c.info.id === id) || { slots }
    let oldSlots = component.slots
    let defaul = [] //default 
    let addComponent = (_attr, _slots) => {
        let info = {
            name: 'Menu Item',
            ui: 'Muse-UI',
            id: guid()
        }
        let itemTemplate = getTemplate(info, _attr, _slots)
        itemTemplate.parentId = id
        components.push(itemTemplate)
        return itemTemplate
    }
    for (let i = 0; i < max; i++) {
        if (oldSlots.default[i]) {
            defaul.push(oldSlots.default[i])
        } else {
            let childAttr = {
                title: {
                    type: 'text',
                    value: 'item' + i
                },
                value: {
                    type: 'text',
                    value: 'item' + i
                }
            }
            defaul.push({ id: addComponent(childAttr).info.id })
        }
    }

    //itemQuantity数值减少时，子属性要对应的删除
    let arr = oldSlots.default.filter(item => { //得到所有要删除的对象
        return defaul.findIndex(({ id }) => id === item.id) === -1
    })
    arr.forEach(({ id }) => {
        let index = components.findIndex(c => c.info.id === id)
        components.splice(index, 1)
    })
    slots.default = defaul
    _Vue.$store.commit('setState', { components: components })

    //获取插槽模板内容
    let subContent = getSlotContent(slots)

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
    let template = `<mu-select-field
                        ${stringAttr}>
                        ${subContent}
                    </mu-select-field>`

    //删除自定义非ui属性
    template = template.replace(`:itemQuantity="${attributes.itemQuantity.value}"`, '')


    return { template, attributes, slots }
}
export default handle
