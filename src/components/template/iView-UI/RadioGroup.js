import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'
// 深度合并
import mergeDeep from '@/utils/mergeDeep'
var handle = function(_attr, _slots, { id }) {
    //定义默认属性
    let attributes = {
            quantity:{
                type:'number',
                value:2
            },
            value:{
                type:'text',
                value:''
            },
            type:{
                type:'selection',
                items:['button',''],
                value:''
            },
            size:{
                type:'selection',
                items:['large','small',''],
                value:''
            },
            vertical:{
                type:'boolean',
                value:false
            }
        },
        slots = {
            default:[]
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)
    if (attributes.quantity.value < 0)
        attributes.quantity.value = 0

    //根据组件不同需要做的不同操作
    let max = _attr.quantity ? _attr.quantity.value : attributes.quantity.value
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let component = components.find(c => c.info.id === id) || { slots }
    let oldSlots = component.slots
    let defaul = [] //default 
    let addComponent = (_attr, _slots) => {
        let info = {
            name: 'Radio',
            ui: 'iView-UI',
            id: guid()
        }
        let colComponent = getTemplate(info, _attr, _slots)
        colComponent.parentId = id
        components.push(colComponent)
        return colComponent
    }
    for (let i = 0; i < max; i++) {
        if (oldSlots.default[i]) {
            defaul.push(oldSlots.default[i])
        } else {
            defaul.push({ id: addComponent().info.id })
        }
    }

    //quantity数值减少时，子属性要对应的删除
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
    let template = `<Radio-group
                        ${stringAttr}>
                        ${subContent}
                    </Radio-group>`

    //删除自定义非ui属性
    template = template.replace(`:quantity="${attributes.quantity.value}"`, '')

    return { template, attributes, slots }
}
export default handle
