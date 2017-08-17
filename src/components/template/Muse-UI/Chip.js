import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'

var handle = function(_attr, _slots, { id }) {
    //定义默认属性
    let attributes = {
            showDelete: {
                type: 'boolean',
                value: false
            },
            deleteIconClass: {
                type: 'text',
                value: ''
            },
            disabled: {
                type: 'boolean',
                value: false
            },
            backgroundColor: {
                type: 'color',
                value: ''
            },
            color: {
                type: 'color',
                value: ''
            }
        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let component = components.find(c => c.info.id === id) || { slots }
    let oldSlots = component.slots

    let addAvatarComponent = (_parentId, _attr, _slots) => {
        let info = {
            name: 'Avatar',
            ui: 'Muse-UI',
            id: guid()
        }
        let component = getTemplate(info, _attr, _slots)
        component.parentId = _parentId
        components.push(component)
        return component
    }
    let defaul = [] //default
    if (slots.default[0]) {
        defaul = slots.default
    } else {
        let attr = {
            icon: {
                type: 'icon',
                value: 'account_circle'
            },
            size: {
                type: 'number',
                value: 32
            }
        }
        defaul.push({
            id: addAvatarComponent(id, attr).info.id
        })
    }

    _Vue.$store.commit('setState', { components: components })
    slots.default = defaul

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
    let template = `<mu-chip  
                    ${stringAttr}>
                    ${subContent}
                </mu-chip>`

    return { template, attributes, slots }
}
export default handle
