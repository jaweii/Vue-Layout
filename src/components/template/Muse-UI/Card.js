import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'

var handle = function(_attr, _slots, _info) {
    //定义默认属性
    let attributes = {},
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let isFirstCreate = !components.find(c => c.info.id === _info.id)
    let newComponents=[]
    let addComponent = function(info) {
        let component = getTemplate(info)
        //尽量每次getTemplate后都重新获取components，避免里面修改了后造成不同步会报错
        components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
        component.parentId = _info.id
        newComponents.push(component)
        return component
    }
    if (isFirstCreate) {
        //添加card-header组件
        let headerInfo = {
            name: 'Card Header',
            ui: 'Muse-UI',
            id: guid()
        }
        let header = addComponent(headerInfo)
        slots.default.push({ id: header.info.id })

        //添加car-media组件
        let mediaInfo = {
            name: 'Card Media',
            ui: 'Muse-UI',
            id: guid()
        }
        let media = addComponent(mediaInfo)
        slots.default.push({ id: media.info.id })

        //添加card-title
        let titleInfo = {
            name: 'Card Title',
            ui: 'Muse-UI',
            id: guid()
        }
        let title = addComponent(titleInfo)
        slots.default.push({ id: title.info.id })

        //添加card-text
        let textInfo = {
            name: 'Card Text',
            ui: 'Muse-UI',
            id: guid()
        }
        let text = addComponent(textInfo)
        slots.default.push({ id: text.info.id })

        //添加card-actions
        let actionsInfo = {
            name: 'Card Actions',
            ui: 'Muse-UI',
            id: guid()
        }
        let actions = addComponent(actionsInfo)
        slots.default.push({ id: actions.info.id })

        components.push.apply(components,newComponents)
        _Vue.$store.commit('setState', { components })
    }

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
    let template = `<mu-card 
                    ${stringAttr}>
                    ${subContent||'&nbsp;'}
                </mu-card>`

    return { template, attributes, slots }
}
export default handle
