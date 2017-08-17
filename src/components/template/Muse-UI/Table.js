import { getTemplate, getSlotContent, getStringTypeAttr } from '@/components/template'
import guid from '@/utils/guid'
// 深度合并
import mergeDeep from '@/utils/mergeDeep'
var handle = function(_attr, _slots, { id }) {
    //定义默认属性
    let attributes = {
            column: {
                type: 'number',
                value: 2
            },
            row: {
                type: 'number',
                value: 2
            },
            fixedHeader: {
                type: 'boolean',
                value: false
            },
            fixedFooter: {
                type: 'boolean',
                value: false
            },
            height: {
                type: 'text',
                value: ''
            },
            enableSelectAll: {
                type: 'boolean',
                value: false
            },
            allRowsSelected: {
                type: 'boolean',
                value: false
            },
            multiSelectable: {
                type: 'boolean',
                value: false
            },
            selectable: {
                type: 'boolean',
                value: false
            },
            showCheckbox: {
                type: 'boolean',
                value: false
            }
        },
        slots = {
            header: [],
            footer: [],
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)
    if (attributes.column.value < 0)
        attributes.column.value = 0
    if (attributes.row.value < 0)
        attributes.row.value = 0

    // //根据组件不同需要做的不同操作
    let column = _attr.column ? _attr.column.value : attributes.column.value
    let row = _attr.row ? _attr.row.value : attributes.row.value
    let components = JSON.parse(JSON.stringify(_Vue.$store.state.components))
    let component = components.find(c => c.info.id === id) || { slots }

    let addComponent = (info, _parentId, _attr, _slots) => {
        let component = getTemplate(info, _attr, _slots)
        component.parentId = _parentId
        components.push(component)
        _Vue.$store.commit('setState', { components })
        return component
    }

    let header, th = []
    //得到header组件
    if (slots.header[0]) {
        header = components.find(c => c.info.id === slots.header[0].id)
    } else {
        header = addComponent({ name: 'Thead', ui: 'Muse-UI', id: guid() }, id)
    }


    //设置表头
    let headerSlots = header.slots.default
    for (let i = 0; i < column; i++) {
        if (headerSlots[i]) {
            th.push(headerSlots[i])
        } else {
            let thId = guid()
            //添加要嵌入到th中的text组件
            let text = addComponent({ name: 'Text', ui: 'Common', id: guid() }, thId, { text: { type: 'text', value: '表头' + i } })
            let thSlots = { default: [{ id: text.info.id }] }
            //添加th组件
            let thComponent = addComponent({ name: 'Th', ui: 'Muse-UI', id: thId }, header.info.id, {}, thSlots)
            //push到th数组
            th.push({ id: thComponent.info.id })
        }
    }

    let headerIndex = components.findIndex(c => c.info.id === header.info.id)
    //保存到components的header组件中
    components[headerIndex].slots.default = th

    let body, tr = []
    //得到body组件
    if (slots.default[0]) {
        body = components.find(c => c.info.id === slots.default[0].id)
    } else {
        body = addComponent({ name: 'Tbody', ui: 'Muse-UI', id: guid() }, id)
    }

    let addColumn = function(column, parentId) {
        let td = []
        for (let j = 0; j < column; j++) {
            let tdId = guid()
            let text = addComponent({ name: 'Text', ui: 'Common', id: guid() }, tdId)
            let tdSlots = { default: [{ id: text.info.id }] }
            let tdComponent = addComponent({ name: 'Td', ui: 'Muse-UI', id: tdId }, parentId, {}, tdSlots)
            td.push({ id: tdId })
        }
        return td
    }
    for (let i = 0; i < row; i++) {
        if (body.slots.default[i]) {
            let index = components.findIndex(c => c.info.id === body.slots.default[i].id)
            let len = components[index].slots.default.length
            //行未改变，列增加的情况
            if (len < column) {
                let td = addColumn(column - len, components[index].info.id)
                components[index].slots.default.push.apply(components[index].slots.default, td)
            }
            //行未改变，列减少了的情况
            if (len > column) {
                let arr = components[index].slots.default.splice(column, len - column) //删除自身不需要的 并返回删除的
                let slots = { default: arr } //构造slots传入递归删除
                del(slots)
            }
            if (column == 0) //为0时跳出本次循环，不往tr中push
                break
            tr.push(body.slots.default[i])
        } else {
            let trId = guid()
            let td = addColumn(column, trId)
            let trComponent = addComponent({ name: 'Tr', ui: 'Muse-UI', id: trId }, body.info.id, {}, { default: td })
            tr.push({ id: trComponent.info.id })

        }
    }

    let bodyIndex = components.findIndex(c => c.info.id === body.info.id)
    components[bodyIndex].slots.default = tr

    // 递归删除要删除组件的子组件
    function del(slots) {
        Object.keys(slots).forEach(slot => {
            slots[slot].forEach((slot) => {
                let index = components.findIndex(c => c.info.id === slot.id)
                let child = components.find(c => c.info.id === slot.id)
                components.splice(index, 1)
                if (Object.keys(child.slots))
                    del(child.slots)
            })
        })
    }
    //column数值减少时，子属性要对应的删除
    function reduce(_slots, _slot) {
        let arr = _slots.filter(item => { //得到所有要删除的对象
            return _slot.findIndex(({ id }) => id === item.id) === -1
        })
        arr.forEach(({ id }) => {
            let component = components.find(c => c.info.id === id)
            if (Object.keys(component.slots)) {
                del(component.slots)
            }
            let index = components.findIndex(c => c.info.id === id)
            components.splice(index, 1)
        })
    }
    reduce(headerSlots, th)
    reduce(body.slots.default, tr)

    //设置table的slots
    slots.header = [{ id: header.info.id }]
    slots.default = [{ id: body.info.id }]
    _Vue.$store.commit('setState', { components })


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
    let template = `<mu-table 
                        ${stringAttr}>
                        ${subContent}
                    </mu-table>`
        //删除自定义非ui属性
    template = template.replace(`:column="${attributes.column.value}"\n:row="${attributes.row.value}"`, '')

    return { template, attributes, slots }
}
export default handle
