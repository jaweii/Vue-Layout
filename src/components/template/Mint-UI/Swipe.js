import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'
var handle = function(_attr, _slots, {id}) {
    //定义默认属性
    let attributes = {
            quantity: {
                type: 'number',
                value: 3
            },
            speed: {
                type: 'number',
                value: ''
            },
            auto: {
                type: 'number',
                value: ''
            },
            defaultIndex: {
                type: 'number',
                value: ''
            },
            continuous: {
                type: 'boolean',
                value: true
            },
            showIndicators: {
                type: 'boolean',
                value: true
            },
            prevent: {
                type: 'boolean',
                value: false
            },
            stopPropagation: {
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
    let max = _attr.quantity ? _attr.quantity.value : attributes.quantity.value
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let component = components.find(c => c.info.id === id) || { slots }
    let oldSlots = component.slots
    let defaul = [] //default 
    let newComponents=[]
    let addComponent = (_attr, _slots) => {
        let info = {
                name: 'Swipe item',
                ui: 'Mint-UI',
                id: guid()
        }
        let itemTemplate = getTemplate(info, _attr, _slots)
            //尽量每次getTemplate后都重新获取components，避免里面修改了后造成不同步会报错
        components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
        itemTemplate.parentId = id
        newComponents.push(itemTemplate)
        return itemTemplate
    }
    for (let i = 0; i < max; i++) {
        if (oldSlots.default[i]) {
            defaul.push(oldSlots.default[i])
        } else {
            defaul.push({ id: addComponent().info.id })
        }
    }
    components.push.apply(components,newComponents)

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
    let template = `<mt-swipe 
                        ${stringAttr}>
                        ${subContent}
                    </mt-swipe>`
        //删除自定义非ui属性
    template = template.replace(`:quantity="${attributes.quantity.value}"`, '')
    return { template, attributes, slots }
}
export default handle
