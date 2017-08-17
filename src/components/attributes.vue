<template>
    <mu-content-block>
        <subAttribute v-if="current" :attributes="current.attributes" style="margin-left:-10px;" @update="updateAttribute" />
    </mu-content-block>
</template>
<script>
import mount from './mount'
import {
    getTemplate
} from './template'
import subAttribute from './subAttribute'
// 深度合并
import mergeDeep from '@/utils/mergeDeep'
export default {
    name: 'attributes',
    data() {
        return {}
    },
    computed: {
        current: { //当前选中组件
            get(value) {
                return this.$store.state.currentComponent
            }
        }
    },
    methods: {
        updateAttribute(attr) { //属性值输入事件
            let components = JSON.parse(JSON.stringify(this.$store.state.components))
            let index = components.findIndex(component => component.info.id === this.current.info.id)
            let info = this.current.info

            attr = mergeDeep(this.current.attributes, attr)
            if (components[index].slot) {
                //对于嵌入组件 需要传入slot 才会在模板上带上slot属性
                attr.slot = components[index].slot
            }
            let component = getTemplate(info, attr, components[index].slots), //更新模板
                attributes = component.attributes

            //getTemplate中可能修改了components，所以重新获取
            components = JSON.parse(JSON.stringify(this.$store.state.components))
            index = components.findIndex(component => component.info.id === this.current.info.id)

            Object.assign(components[index]['attributes'], attributes) //更新从getTemplate获取到的最新属性
            components[index]['slots'] = component.slots
            components[index].template = component.template
            this.$store.commit('setState', {
                components
            })
            this.$store.commit('setState', {
                currentComponent: components[index]
            })

            //更新数据到vuex完毕

            //下面触发视图层变化
            if (!components[index].parentId) {
                mount(component.info.id, component, this)
            } else {
                //对于嵌套组件，更新其顶级父组件
                let topComponent = this.getParentComponent(components[index])
                Object.assign(topComponent, getTemplate(topComponent.info, topComponent.attributes, topComponent.slots))
                let i = components.findIndex(c => c.info.id === topComponent.info.id)
                components[i] = topComponent
                this.$store.commit('setState', {
                    components
                })

                mount(topComponent.info.id, topComponent, this)
            }

            //有数据更新操作，就删除之前被删除的备份。只提供撤销删除的撤销功能
            this.$store.commit('setState',{backupComponents:[]})
        },
        getParentComponent(component) {
            let components = JSON.parse(JSON.stringify(this.$store.state.components))
            if (component.parentId) {
                return this.getParentComponent(components.find(c => c.info.id === component.parentId))
            } else {
                return component
            }
        }
    },
    components: {
        subAttribute
    }
}
</script>
