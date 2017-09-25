import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'

var handle = function(_attr, _slots, _info) {
    //定义默认属性
    let attributes = {
            bordered: {
                type: 'boolean',
                value: false
            },
            ['dis-hover']: {
                type: 'boolean',
                value: false
            },
            shadow: {
                type: 'boolean',
                value: false
            },
            padding: {
                type: 'number',
                value: ''
            }
        },
        slots = {
            title: [],
            extra: [],
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let isFirstCreate = !components.find(c => c.info.id === _info.id)
    let newComponents = []
    let addComponent = function(info, slot) {
        let component = getTemplate(info, slot)
            //尽量每次getTemplate后都重新获取components，避免里面修改了后造成不同步会报错
        components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
        component.parentId = _info.id
        newComponents.push(component)
        return component
    }
    if (isFirstCreate) {
        //添加title组件
        let titleInfo = {
            name: 'Div',
            ui: 'Common',
            id: guid()
        }
        let title = addComponent(titleInfo, { slot: 'title', text: {type:'text',value:'title'}})
        slots.title.push({ id: title.info.id })

        //添加text组件
        let textInfo = {
            name: 'Text',
            ui: 'Common',
            id: guid()
        }
        let text = addComponent(textInfo)
        slots.default.push({ id: text.info.id })


        components.push.apply(components, newComponents)
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
