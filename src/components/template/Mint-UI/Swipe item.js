import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'

var handle = function(_attr, _slots, _info) {
    //定义默认属性
    let attributes = {
        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let isFirstCreate = !components.find(c => c.info.id === _info.id)
    let addComponent = function(_attr, _slots) {
        let info = {
            name: 'Img',
            ui: 'Common',
            id: guid()
        }
        let component = getTemplate(info, _attr, _slots)
            //尽量每次getTemplate后都重新获取components，避免里面修改了后造成不同步会报错
        components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
        component.parentId = _info.id
        components.push(component)
        return component
    }
    if (isFirstCreate) {
        let img = addComponent()
        slots.default.push({ id: img.info.id })
        _Vue.$store.commit('setState', { components })
    }

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
    let template = `<mt-swipe-item 
                        ${stringAttr}>
                        ${subContent}
                    </mt-swipe-item>`

    return { template, attributes, slots }
}
export default handle
